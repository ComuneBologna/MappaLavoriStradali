using Asf.RoadWorks.BusinessLogic.Enums;
using Asf.RoadWorks.BusinessLogic.Events;
using Asf.RoadWorks.BusinessLogic.Interfaces;
using Asf.RoadWorks.BusinessLogic.Localization;
using Asf.RoadWorks.BusinessLogic.Models;
using Asf.RoadWorks.DataAccessLayer;
using Asf.RoadWorks.DataAccessLayer.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SmartTech.Common.Extensions;
using SmartTech.Common.Models;
using SmartTech.Common.Services;
using SmartTech.Infrastructure;
using SmartTech.Infrastructure.DataAccessLayer.EFCore;
using SmartTech.Infrastructure.Exceptions;
using SmartTech.Infrastructure.Extensions;
using SmartTech.Infrastructure.Maps;
using SmartTech.Infrastructure.Search;
using SmartTech.Infrastructure.Storage;
using SmartTech.Infrastructure.SystemEvents;
using SmartTech.Infrastructure.Validations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Asf.RoadWorks.BusinessLogic
{
	class RoadWorksService : IRoadWorksService
	{
		readonly IUserContext _userContext;
		readonly IFileStorage _storageManager;
		readonly RoadWorksDbContext _dbContext;
		readonly IMapsService _googleMapsService;
		readonly IBackofficeCoreService _coreService;
		readonly IPlaceNameService _placeNameService;
		readonly ISystemEventManager _sysEventManager;
		readonly SmartPAClientData _smartPAClientData;
		readonly IBackofficeUsersService _usersService;
		readonly IHttpClientFactory _httpClientFactory;

		public RoadWorksService(RoadWorksDbContext dbContext, IFileStorage storageManager,
								IUserContext userContext, IHttpClientFactory httpClientFactory, IPlaceNameService placeNameService,
								IOptions<SmartPAClientData> smartPAClientDataOptions, IBackofficeUsersService usersService,
								ISystemEventManager sysEventManager, IMapsService googleMapsService, IBackofficeCoreService coreService)
		{
			_dbContext = dbContext;
			_coreService = coreService;
			_userContext = userContext;
			_usersService = usersService;
			_storageManager = storageManager;
			_sysEventManager = sysEventManager;
			_placeNameService = placeNameService;
			_googleMapsService = googleMapsService;
			_httpClientFactory = httpClientFactory;
			_smartPAClientData = smartPAClientDataOptions.Value;
		}

		async Task<IEnumerable<ValidYear>> IRoadWorksService.GetAvalaibleYears() => await GetValidYears();

		async Task IRoadWorksService.AddRoadWork(RoadWorkWrite work)
		{
			work?.Validate();

			var addressNumbers = await GetAddressNumbers(work.Address);

			if ((addressNumbers?.Count ?? 0) <= 0)
				throw new BusinessLogicValidationException(string.Format(Resources.RoadWork_Address_NotExists, work.Address));

			if (!string.IsNullOrWhiteSpace(work.AddressNumberFrom) && !addressNumbers.Select(an => an.Number).Contains(work.AddressNumberFrom))
				throw new BusinessLogicValidationException(string.Format(Resources.RoadWork_AddressNumber_NotExists, work.AddressNumberFrom));

			if (!string.IsNullOrWhiteSpace(work.AddressNumberTo) && !addressNumbers.Select(an => an.Number).Contains(work.AddressNumberTo))
				throw new BusinessLogicValidationException(string.Format(Resources.RoadWork_AddressNumber_NotExists, work.AddressNumberTo));

			var validYears = (await GetValidYears()).Select(vy => vy.Year);

			if (!validYears.Contains(work.Year.Value))
				throw new BusinessLogicValidationException(string.Format(Resources.RoadWork_Year_Expired, work.Year));

			var works = await _dbContext.Works
									.Where(w => w.AuthorityId == _userContext.AuthorityId && w.Year == work.Year &&
												w.Address == work.Address && w.Status != RoadWorkStatus.Deleted)
									.ToListAsync();
			var companyId = _userContext.CompanyId;
			var addressPointFrom = !string.IsNullOrWhiteSpace(work.AddressNumberFrom) ? addressNumbers.FirstOrDefault(an => an.Number.Equals(work.AddressNumberFrom)) : default;
			var addressPointTo = !string.IsNullOrWhiteSpace(work.AddressNumberTo) ? addressNumbers.FirstOrDefault(an => an.Number.Equals(work.AddressNumberTo)) : default;
			var workToSave = new RoadWorkEntity
			{
				Address = work.Address,
				AddressNumberFrom = work.AddressNumberFrom,
				AddressNumberTo = work.AddressNumberTo,
				AddressPointFrom = addressPointFrom != default ? addressPointFrom.MapPoint.CoordinateToPoint() : default,
				AddressPointTo = addressPointTo != default ? addressPointTo.MapPoint.CoordinateToPoint() : default,
				AuthorityId = _userContext.AuthorityId,
				Category = !companyId.HasValue ? work.Category : RoadWorkCategories.Scheduled,
				CompanyId = companyId ?? work.CompanyId,
				Description = work.Description,
				EffectiveEndDate = companyId != null ? null : work.EffectiveEndDate,
				EffectiveStartDate = companyId != null ? null : work.EffectiveStartDate,
				EstimatedEndDate = work.EstimatedEndDate,
				EstimatedStartDate = work.EstimatedStartDate,
				GeoFeatureContainer = work.GeoFeatureContainer,
				Neighborhoods = work.Neighborhoods.Select(s => new RoadWorkNeighborhoodEntity()
				{
					NeighborhoodName = s,
				}).ToList(),
				Notes = work.Notes,
				NotScheduledStatus = !companyId.HasValue && work.Category == RoadWorkCategories.NotScheduled ? NotScheduledCategoryStatus.Proposed : default(NotScheduledCategoryStatus?),
				IsOverlap = works.Count > 0 && !work.IsOverlap || work.IsOverlap,
				PinPoint = work.PinPoint != default ? work.PinPoint.CoordinateToPoint() : default,
				Priority = works.Count > 0 && !work.IsOverlap && !work.Priority.HasValue ? default : work.Priority,
				RoadWays = work.Roadways.Select(s => new RoadWorksRoadwayEntity()
				{
					RoadwayId = s
				}).ToList(),
				TrafficChangesMeasure = !companyId.HasValue ? work.TrafficChangesMeasure : null,
				VisualizationNotes = work.VisualizationNotes,
				DescriptionForCitizens = work.DescriptionForCitizens,
				Year = work.Year.Value,
				CompanyReferentName = work.CompanyReferentName,
				CompanyReferentPhoneNumber = work.CompanyReferentPhoneNumber,
				MunicipalityReferentName = work.MunicipalityReferentName,
				MunicipalityReferentPhoneNumber = work.MunicipalityReferentPhoneNumber,
				Link = companyId != null ? null : work.Link,
				PublishStatus = PublishStatus.Draft
			};

			if (workToSave.Category == RoadWorkCategories.Planned && (workToSave.EffectiveStartDate.HasValue || workToSave.EffectiveEndDate.HasValue))
				workToSave.Category = RoadWorkCategories.Scheduled;

			if (workToSave.Category != RoadWorkCategories.Planned && !workToSave.EstimatedStartDate.HasValue && !workToSave.EstimatedEndDate.HasValue && !workToSave.EffectiveStartDate.HasValue && !workToSave.EffectiveEndDate.HasValue)
				throw new BusinessLogicValidationException(string.Format(Resources.RoadWork_Date_IsMandatory, workToSave.Category.Equals(RoadWorkCategories.Scheduled) ? "programmato" : "non programmato"));

			if (workToSave.PinPoint == default)
			{
				var geoContainerModel = await GenerateGeoFeatureContainer(work.Address, work.AddressNumberFrom, work.AddressNumberTo);

				workToSave.GeoFeatureContainer = geoContainerModel.JsonSerialize(isIntendFormat: false, useCamelCaseConvention: true);
			}

			workToSave.SetRoadWorkStatus();
			_dbContext.Works.Add(workToSave);

			var filteredWorks = works.Where(w => w.IsOverlap == default)
				.Select(w =>
				{
					w.IsOverlap = true;

					return w;
				})
				.ToList();

			if (filteredWorks.Count > 0)
				_dbContext.Works.UpdateRange(filteredWorks);

			if (work.Attachments.Count() > 0)
			{
				var ids = work.Attachments.Select(wa => wa.Id);

				var attachmentsToUpdate = await _dbContext.Attachments.Where(ae => ids.Contains(ae.Id) && ae.WorkId == null).ToListAsync();

				attachmentsToUpdate = attachmentsToUpdate.Join(work.Attachments, ae => ae.Id, wa => wa.Id, (ae, wa) => new
				{
					ae,
					wa
				}).Select(s =>
				{
					s.ae.Work = workToSave;
					s.ae.IsPublic = s.wa.IsPublic;

					return s.ae;
				}).Where(ae => ae.WorkId != null).ToList();

				_dbContext.UpdateRange(attachmentsToUpdate);
			}

			await _dbContext.SaveChangesAsync();

			await _dbContext.AuditWorks.AddAsync(new RoadWorkAuditEntity
			{
				AuditType = AuditTypes.Create,
				DisplayName = _userContext.DisplayName,
				WorkId = workToSave.Id,
				LastUpdate = DateTime.UtcNow
			});

			await _dbContext.SaveChangesAsync();

			//TO-DO: da decommentare quando avremo lo spazio azure
			//var lastUpdate = DateTime.UtcNow;

			//await new SystemEvent()
			//{
			//	Payload = string.Empty,
			//	Properties = new Dictionary<string, string>
			//			{
			//				{ "ContainerName", _blobContainerName },
			//				{ "StoragePath", $"audit/works/{lastUpdate.ToString("yyyyMMddHHmm")}/{workToSave.Id}.json" },
			//				{ "WorkId", workToSave.Id.ToString() },
			//				{ "LastUpdate", lastUpdate.ToString() },
			//				{ "DisplayName", _userContext.DisplayName }
			//			}
			//}.SendToTopicAsync("roadworkevents", _serviceBusConnectionString);
		}

		async Task IRoadWorksService.DeleteRoadWork(long workId)
		{
			if (workId <= 0)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, Resources.RoadWork_NotFound);

			var workToDelete = await _dbContext.Works.FirstOrDefaultAsync(we => we.AuthorityId == _userContext.AuthorityId && we.Id == workId);
			//var workToDeleteSerialized = workToDelete.JsonSerialize(isIntendFormat: false);

			if (workToDelete == default)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, Resources.RoadWork_NotFound);

			var validYears = (await GetValidYears()).Select(vy => vy.Year);

			if (!validYears.Contains(workToDelete.Year))
				throw new BusinessLogicValidationException(Resources.RoadWork_Terms_Expired);

			workToDelete.Status = RoadWorkStatus.Deleted;

			await _dbContext.AuditWorks.AddAsync(new RoadWorkAuditEntity
			{
				AuditType = AuditTypes.Delete,
				DisplayName = _userContext.DisplayName,
				WorkId = workId,
				LastUpdate = DateTime.UtcNow
			});

			await _dbContext.SaveChangesAsync();

			//TO-DO: da decommentare quando avremo lo spazio azure
			//var lastUpdate = DateTime.UtcNow;

			//await new SystemEvent()
			//{
			//	Payload = workToDeleteSerialized,
			//	Properties = new Dictionary<string, string>
			//			{
			//				{ "ContainerName", _blobContainerName },
			//				{ "StoragePath", $"audit/works/{lastUpdate.ToString("yyyyMMddHHmm")}/{workId}.json" },
			//				{ "WorkId", workId.ToString() },
			//				{ "LastUpdate", lastUpdate.ToString() },
			//				{ "DisplayName", _userContext.DisplayName }
			//				{ "IsDeleted", true }
			//			}
			//}.SendToTopicAsync("roadworkevents", _serviceBusConnectionString);
		}

		async Task<List<RoadWorkMap>> IRoadWorksService.GetRoadWorksForCitizens(long authorityId)
		{
			var validStatus = new List<RoadWorkStatus>
			{
				RoadWorkStatus.ComingSoon,
				RoadWorkStatus.InProgress
			};
			var now = DateTime.UtcNow;
			//TODO: Gestire una configurazione per i giorni di visualizzazione di un lavoro sul portale dei cittadini
			var threeWeeks = now.AddDays(21);
			var fiveDaysBeforeNow = now.AddDays(-5);
			var query = _dbContext.Works.AsNoTracking()
									.Include(w => w.Company)
									.Include(w => w.Neighborhoods)
									.Include(w => w.RoadWays)
										.ThenInclude(rsr => rsr.Roadway)
									.Where(w => w.AuthorityId == authorityId && w.PublishStatus == PublishStatus.Approved && w.Status != null &&
												validStatus.Contains(w.Status.Value) && w.EffectiveStartDate != null &&
												w.EffectiveEndDate == null);

			var query2 = _dbContext.Works.AsNoTracking()
									.Include(w => w.Company)
									.Include(w => w.Neighborhoods)
									.Include(w => w.RoadWays)
										.ThenInclude(rsr => rsr.Roadway)
									.Where(w => w.AuthorityId == authorityId && w.PublishStatus == PublishStatus.Approved && w.Status != null && validStatus.Contains(w.Status.Value) &&
												(w.EffectiveStartDate != null || w.EffectiveEndDate != null) &&
												((w.EffectiveStartDate ?? now) <= now || (w.EffectiveStartDate ?? now) <= threeWeeks) &&
												((w.EffectiveEndDate ?? threeWeeks) >= now || (w.EffectiveEndDate ?? threeWeeks) < threeWeeks));

			var query3 = _dbContext.Works.AsNoTracking()
									.Include(w => w.Company)
									.Include(w => w.Neighborhoods)
									.Include(w => w.RoadWays)
										.ThenInclude(rsr => rsr.Roadway)
									.Where(w => w.AuthorityId == authorityId && w.PublishStatus == PublishStatus.Approved && w.Status != null &&
												w.Status.Value.Equals(RoadWorkStatus.Completed) && w.EffectiveEndDate != null &&
												w.EffectiveEndDate >= fiveDaysBeforeNow && w.EffectiveEndDate <= now);

			//var query2 = _dbContext.Works.AsNoTracking()
			//						.Include(w => w.Company)
			//						.Include(w => w.Neighborhoods)
			//						.Include(w => w.RoadWays)
			//							.ThenInclude(rsr => rsr.Roadway)
			//						.Where(w => w.AuthorityId == authorityId && w.PublishStatus == PublishStatus.Approved && w.Status != null && validStatus.Contains(w.Status.Value) &&
			//									(w.EstimatedStartDate != null || w.EstimatedEndDate != null) &&
			//									((w.EstimatedStartDate ?? now) <= now || (w.EstimatedStartDate ?? now) <= threeWeeks) &&
			//									((w.EstimatedEndDate ?? threeWeeks) >= now || (w.EstimatedEndDate ?? threeWeeks) < threeWeeks));

			//var query3 = _dbContext.Works.AsNoTracking()
			//						.Include(w => w.Company)
			//						.Include(w => w.Neighborhoods)
			//						.Include(w => w.RoadWays)
			//							.ThenInclude(rsr => rsr.Roadway)
			//						.Where(w => w.AuthorityId == authorityId && w.PublishStatus == PublishStatus.Approved && w.Status != null &&
			//									w.Status.Value.Equals(RoadWorkStatus.Completed) && (w.EstimatedEndDate != null || w.EffectiveEndDate != null) &&
			//									(w.EstimatedEndDate ?? w.EffectiveEndDate) >= fiveDaysBeforeNow &&
			//									(w.EstimatedEndDate ?? w.EffectiveEndDate) <= now);

			return (await query.ToListAsync())
				.Concat(await query2.ToListAsync())
				.Concat(await query3.ToListAsync())
				.GroupBy(r => r.Id)
				.Select(g => g.FirstOrDefault())
				.Where(rw => rw != null)
				.Select(rw => new RoadWorkMap
				{
					Address = rw.Address,
					AddressNumberFrom = rw.AddressNumberFrom,
					AddressNumberTo = rw.AddressNumberTo,
					Category = rw.Category,
					CompanyId = rw.CompanyId,
					CompanyIsOperationalUnit = rw.Company.IsOperationalUnit,
					CompanyName = rw.Company.Name,
					CompanyReferentName = rw.CompanyReferentName,
					CompanyReferentPhoneNumber = rw.CompanyReferentPhoneNumber,
					Description = rw.Description,
					EffectiveEndDate = rw.EffectiveEndDate,
					EffectiveStartDate = rw.EffectiveStartDate,
					EstimatedEndDate = rw.EstimatedEndDate,
					EstimatedStartDate = rw.EstimatedStartDate,
					GeoFeatureContainer = rw.GeoFeatureContainer,
					Id = rw.Id,
					PublishStatus = rw.PublishStatus,
					Link = rw.Link,
					MunicipalityReferentName = rw.MunicipalityReferentName,
					MunicipalityReferentPhoneNumber = rw.MunicipalityReferentPhoneNumber,
					Neighborhoods = rw.Neighborhoods.Select(sm => sm.NeighborhoodName),
					Notes = rw.Notes,
					NotScheduledStatus = rw.NotScheduledStatus,
					IsOverlap = rw.IsOverlap,
					Priority = rw.Priority,
					Roadways = rw.RoadWays.Select(re => re.Roadway.Name),
					VisualizationNotes = rw.VisualizationNotes,
					DescriptionForCitizens = rw.DescriptionForCitizens,
					Status = rw.Status,
					TrafficChangesMeasure = rw.TrafficChangesMeasure,
					Year = rw.Year
				}).ToList();
		}

		async Task<FilterResult<T>> IRoadWorksService.SearchRoadWorks<T>(RoadWorksSearchCriteria searchCriteria)
		{
			if (_userContext.CompanyId.HasValue && typeof(T) == typeof(RoadWorkInfo))
				return new();

			var sc = searchCriteria ?? new RoadWorksSearchCriteria();
			var query = _dbContext.Works.AsNoTracking()
							.Include(w => w.Company)
								.ThenInclude(c => c.Users)
							.Include(w => w.Neighborhoods)
							.Include(w => w.RoadWays)
								.ThenInclude(rw => rw.Roadway)
							.Include(w => w.Attachments)
							.Where(w => w.AuthorityId == _userContext.AuthorityId);
			var companyId = _userContext.CompanyId ?? sc.CompanyId;

			if (companyId.HasValue)
				query = query.Where(rw => rw.CompanyId == companyId);

			if (sc.Id.HasValue)
				query = query.Where(rw => rw.Id == sc.Id.Value);
			else
			{
				if (!_userContext.CompanyId.HasValue)
				{
					if (sc.CompanyType.HasValue)
					{
						var isOperationalUnit = sc.CompanyType.Equals(CompanyTypes.OperationalUnit);

						query = query.Where(rw => rw.Company.IsOperationalUnit == isOperationalUnit);
					}

					if (sc.VisibleType.HasValue)
					{
						var isVisible = sc.VisibleType.Equals(VisibleTypes.Published);

						query = query.Where(rw => rw.PublishStatus == PublishStatus.Approved);
					}
				}

				if (sc.PublishStatus.HasValue)
				{
					query = sc.PublishStatus.Value switch
					{
						PublishStatusForSearch.None =>
							query = query.Where(rw => rw.PublishStatus != PublishStatus.Draft &&
												rw.PublishStatus != PublishStatus.WaitingToApprove &&
												rw.PublishStatus != PublishStatus.Approved && rw.PublishStatus != default),
						PublishStatusForSearch.Draft =>
							query.Where(rw => rw.PublishStatus == PublishStatus.Draft),
						PublishStatusForSearch.WaitingToApprove =>
							query.Where(rw => rw.PublishStatus == PublishStatus.WaitingToApprove),
						PublishStatusForSearch.Approved =>
							query.Where(rw => rw.PublishStatus == PublishStatus.Approved),
						PublishStatusForSearch.Draft | PublishStatusForSearch.WaitingToApprove =>
							query.Where(rw => rw.PublishStatus == PublishStatus.Draft ||
												rw.PublishStatus == PublishStatus.WaitingToApprove),
						PublishStatusForSearch.Draft | PublishStatusForSearch.Approved =>
							query.Where(rw => rw.PublishStatus == PublishStatus.Draft || rw.PublishStatus == PublishStatus.Approved),
						PublishStatusForSearch.WaitingToApprove | PublishStatusForSearch.Approved =>
							query.Where(rw => rw.PublishStatus == PublishStatus.WaitingToApprove ||
												rw.PublishStatus == PublishStatus.Approved),
						PublishStatusForSearch.Draft | PublishStatusForSearch.WaitingToApprove | PublishStatusForSearch.Approved =>
							query.Where(rw => rw.PublishStatus == PublishStatus.Draft ||
												rw.PublishStatus == PublishStatus.WaitingToApprove ||
												rw.PublishStatus == PublishStatus.Approved),
						_ => query,
					};
				}

				if (sc.Categories.Count > 0)
					query = query.Where(rw => sc.Categories.Contains(rw.Category));

				if (sc.NotScheduledStatus.HasValue)
					query = query.Where(rw => rw.NotScheduledStatus.Equals(sc.NotScheduledStatus.Value));

				if (!string.IsNullOrWhiteSpace(sc.AddressName))
					query = query.Where(rw => rw.Address.Contains(sc.AddressName));

				if (!string.IsNullOrWhiteSpace(sc.Neighborhood))
					query = query.Where(rw => rw.Neighborhoods.Where(n => n.NeighborhoodName == sc.Neighborhood).Count() > 0);

				if (sc.IsOverlap.HasValue)
					query = query.Where(rw => rw.IsOverlap.Equals(sc.IsOverlap.Value));

				if (!string.IsNullOrWhiteSpace(sc.Description))
					query = query.Where(rw => rw.Description.Contains(sc.Description));

				if (sc.Priorities.HasValue)
					query = query.Where(rw => rw.Priority.Equals(sc.Priorities.Value));

				if (!string.IsNullOrWhiteSpace(sc.RoadwayName))
					query = query.Where(rw => rw.RoadWays.Where(rwy => rwy.Roadway.Name == sc.RoadwayName).Count() > 0);

				if (sc.Status.HasValue)
					query = query.Where(rw => rw.Status.Equals(sc.Status.Value));
				else
					query = query.Where(rw => rw.Status != RoadWorkStatus.Deleted);

				if (sc.YearFrom.HasValue || sc.YearTo.HasValue)
				{
					var yearFrom = sc.YearFrom ?? sc.YearTo;
					var yearTo = sc.YearTo ?? sc.YearFrom;

					if ((yearTo - yearFrom) > 5)
						throw new BusinessLogicValidationException(Resources.RoadWork_Year_InvalidRange);

					query = query.Where(rw => rw.Year >= yearFrom && rw.Year <= yearTo);
				}

				if (sc.EffectiveStartDateFrom.HasValue)
					query = query.Where(rw => rw.EffectiveStartDate >= sc.EffectiveStartDateFrom.Value);

				if (sc.EffectiveStartDateTo.HasValue)
					query = query.Where(rw => rw.EffectiveStartDate <= sc.EffectiveStartDateTo.Value);

				if (sc.EffectiveEndDateFrom.HasValue)
					query = query.Where(rw => rw.EffectiveEndDate >= sc.EffectiveEndDateFrom.Value);

				if (sc.EffectiveEndDateTo.HasValue)
					query = query.Where(rw => rw.EffectiveEndDate <= sc.EffectiveEndDateTo.Value);
			}


			var result = await query.OrderAndPageAsync(new FilterCriteria<RoadWorkEntity>()
			{
				ItemsPerPage = searchCriteria.ItemsPerPage,
				PageNumber = searchCriteria.PageNumber,
				SortCriterias = searchCriteria.MapRoadWorkOC()
			});

			if (typeof(T) == typeof(RoadWorkInfo))
			{
				var works = new List<RoadWorkInfo>();
				var tasks = result.Items.Select(async wr =>
				{
					var person = await GetUserInfo(wr.Company.Users.FirstOrDefault()?.UserId);

					return new RoadWorkInfo
					{
						AddressName = wr.Address,
						AddressNumberFrom = wr.AddressNumberFrom,
						AddressNumberTo = wr.AddressNumberTo,
						CategoryName = wr.Category.Equals(RoadWorkCategories.Scheduled) ? "Lavoro programmato" :
										wr.Category.Equals(RoadWorkCategories.NotScheduled) ? "Lavoro non programmato" : "Pianificato",
						CompanyName = wr.Company.Name,
						Description = wr.Description,
						EndDate = wr.EffectiveEndDate,
						Neighborhoods = wr.Neighborhoods.Select(n => n.NeighborhoodName).ToList(),
						Notes = wr.Notes,
						NotPlannedStatus = wr.Category.Equals(RoadWorkCategories.NotScheduled) && wr.NotScheduledStatus.HasValue ? ConvertNotPlannedStatusToString(wr.NotScheduledStatus.Value) : "",
						PersonEmail = person?.Email,
						PersonName = person?.Name,
						PersonSurname = person?.Surname,
						StartDate = wr.EffectiveStartDate,
						Year = wr.Year,
						VisualizationNotes = wr.VisualizationNotes,
						IsOverlap = wr.IsOverlap,
						RoadWays = wr.RoadWays.Select(r => r.Roadway?.Name).ToList()
					};
				});

				works.AddRange(await Task.WhenAll(tasks));

				return new FilterResult<T>
				{
					TotalCount = result.TotalCount,
					Items = works.Cast<T>()
				};
			}

			return new FilterResult<T>
			{
				TotalCount = result.TotalCount,
				Items = typeof(T) == typeof(RoadWork) ? result.Items.Select(rwe => new RoadWork
				{
					Address = rwe.Address,
					AddressNumberFrom = rwe.AddressNumberFrom,
					AddressNumberTo = rwe.AddressNumberTo,
					Category = rwe.Category,
					CompanyId = rwe.CompanyId,
					CompanyName = rwe.Company.Name,
					Description = rwe.Description,
					EffectiveEndDate = rwe.EffectiveEndDate,
					EffectiveStartDate = rwe.EffectiveStartDate,
					EstimatedEndDate = rwe.EstimatedEndDate,
					EstimatedStartDate = rwe.EstimatedStartDate,
					Id = rwe.Id,
					PublishStatus = rwe.PublishStatus,
					Link = rwe.Link,
					Neighborhoods = rwe.Neighborhoods.Select(sm => sm.NeighborhoodName),
					Notes = rwe.Notes,
					NotScheduledStatus = rwe.NotScheduledStatus,
					IsOverlap = rwe.IsOverlap,
					Priority = rwe.Priority,
					Roadways = rwe.RoadWays.Select(re => re.Roadway.Name),
					VisualizationNotes = rwe.VisualizationNotes,
					DescriptionForCitizens = rwe.DescriptionForCitizens,
					Status = rwe.Status,
					Year = rwe.Year,
					CompanyReferentName = rwe.CompanyReferentName,
					CompanyReferentPhoneNumber = rwe.CompanyReferentPhoneNumber,
					MunicipalityReferentName = rwe.MunicipalityReferentName,
					MunicipalityReferentPhoneNumber = rwe.MunicipalityReferentPhoneNumber,
					TrafficChangesMeasure = rwe.TrafficChangesMeasure
				}).Cast<T>() : typeof(T) == typeof(RoadWorkMap) ? result.Items.Select(rwe => new RoadWorkMap
				{
					Address = rwe.Address,
					AddressNumberFrom = rwe.AddressNumberFrom,
					AddressNumberTo = rwe.AddressNumberTo,
					Category = rwe.Category,
					CompanyId = rwe.CompanyId,
					CompanyIsOperationalUnit = rwe.Company.IsOperationalUnit,
					CompanyName = rwe.Company.Name,
					Description = rwe.Description,
					EffectiveEndDate = rwe.EffectiveEndDate,
					EffectiveStartDate = rwe.EffectiveStartDate,
					EstimatedEndDate = rwe.EstimatedEndDate,
					EstimatedStartDate = rwe.EstimatedStartDate,
					Id = rwe.Id,
					Link = rwe.Link,
					GeoFeatureContainer = rwe.GeoFeatureContainer,
					PublishStatus = rwe.PublishStatus,
					Neighborhoods = rwe.Neighborhoods.Select(sm => sm.NeighborhoodName),
					Notes = rwe.Notes,
					NotScheduledStatus = rwe.NotScheduledStatus,
					IsOverlap = rwe.IsOverlap,
					Priority = rwe.Priority,
					Roadways = rwe.RoadWays.Select(re => re.Roadway.Name),
					VisualizationNotes = rwe.VisualizationNotes,
					DescriptionForCitizens = rwe.DescriptionForCitizens,
					Status = rwe.Status,
					Year = rwe.Year,
					CompanyReferentName = rwe.CompanyReferentName,
					CompanyReferentPhoneNumber = rwe.CompanyReferentPhoneNumber,
					MunicipalityReferentName = rwe.MunicipalityReferentName,
					MunicipalityReferentPhoneNumber = rwe.MunicipalityReferentPhoneNumber,
					TrafficChangesMeasure = rwe.TrafficChangesMeasure
				}).Cast<T>() : result.Items.Select(rwe => new RoadWorkDetail
				{
					Address = rwe.Address,
					AddressNumberFrom = rwe.AddressNumberFrom,
					AddressNumberTo = rwe.AddressNumberTo,
					AddressPointFrom = rwe.AddressPointFrom != null ? new MapCoordinate
					{
						Latitude = rwe.AddressPointFrom.Y,
						Longitude = rwe.AddressPointFrom.X
					} : null,
					AddressPointTo = rwe.AddressPointTo != null ? new MapCoordinate
					{
						Latitude = rwe.AddressPointTo.Y,
						Longitude = rwe.AddressPointTo.X
					} : null,
					Attachments = rwe.Attachments.Select(rwae => new RoadWorkAttachmentBase
					{
						Id = rwae.Id,
						IsPublic = rwae.IsPublic != null && rwae.IsPublic.Value
					}),
					Category = rwe.Category,
					CompanyId = rwe.CompanyId,
					Description = rwe.Description,
					EffectiveEndDate = rwe.EffectiveEndDate,
					EffectiveStartDate = rwe.EffectiveStartDate,
					EstimatedEndDate = rwe.EstimatedEndDate,
					Link = rwe.Link,
					EstimatedStartDate = rwe.EstimatedStartDate,
					GeoFeatureContainer = rwe.GeoFeatureContainer,
					Id = rwe.Id,

					PublishStatus = rwe.PublishStatus,
					Neighborhoods = rwe.Neighborhoods.Select(sm => sm.NeighborhoodName),
					Notes = rwe.Notes,
					NotScheduledStatus = rwe.NotScheduledStatus,
					IsOverlap = rwe.IsOverlap,
					PinPoint = rwe.PinPoint != null ? new MapCoordinate
					{
						Latitude = rwe.PinPoint.Y,
						Longitude = rwe.PinPoint.X
					} : default,
					Priority = rwe.Priority,
					Roadways = rwe.RoadWays.Select(re => new Roadway { Id = re.Roadway.Id, Name = re.Roadway.Name }),
					Section = null,
					VisualizationNotes = rwe.VisualizationNotes,
					DescriptionForCitizens = rwe.DescriptionForCitizens,
					Status = rwe.Status,
					Year = rwe.Year,
					CompanyReferentName = rwe.CompanyReferentName,
					CompanyReferentPhoneNumber = rwe.CompanyReferentPhoneNumber,
					MunicipalityReferentName = rwe.MunicipalityReferentName,
					MunicipalityReferentPhoneNumber = rwe.MunicipalityReferentPhoneNumber,
					TrafficChangesMeasure = rwe.TrafficChangesMeasure
				}).Cast<T>()
			};
		}

		async Task IRoadWorksService.UpdateRoadWork(long id, RoadWorkUpdate work)
		{
			if (id <= 0)
				throw new BusinessLogicValidationException(Resources.RoadWork_NotFound);

			work?.Validate();

			if (!_userContext.CompanyId.HasValue && work.Category.Equals(RoadWorkCategories.NotScheduled) && !work.NotScheduledStatus.HasValue)
				throw new BusinessLogicValidationException(Resources.RoadWork_InvalidScheduler);

			var addressNumbers = await GetAddressNumbers(work.Address);

			if ((addressNumbers?.Count ?? 0) <= 0)
				throw new BusinessLogicValidationException(string.Format(Resources.RoadWork_Address_NotExists, work.Address));

			if (!string.IsNullOrWhiteSpace(work.AddressNumberFrom) && !addressNumbers.Select(an => an.Number).Contains(work.AddressNumberFrom))
				throw new BusinessLogicValidationException(string.Format(Resources.RoadWork_AddressNumber_NotExists, work.AddressNumberFrom));

			if (!string.IsNullOrWhiteSpace(work.AddressNumberTo) && !addressNumbers.Select(an => an.Number).Contains(work.AddressNumberTo))
				throw new BusinessLogicValidationException(string.Format(Resources.RoadWork_AddressNumber_NotExists, work.AddressNumberTo));

			var workToUpdate = await _dbContext.Works
								.Include(w => w.RoadWays)
								.Include(w => w.Neighborhoods)
								.FirstOrDefaultAsync(w => w.AuthorityId == _userContext.AuthorityId && w.Id == id);
			//var workToUpdateSerialized = workToUpdate.JsonSerialize(isIntendFormat: false);

			if (workToUpdate == default)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, Resources.RoadWork_NotFound);

			var validYears = (await GetValidYears()).Select(vy => vy.Year);

			if (!validYears.Contains(workToUpdate.Year) || !validYears.Contains(work.Year.Value))
				throw new BusinessLogicValidationException(Resources.RoadWork_Terms_Expired);

			var attachmentToDelete = default(List<RoadWorkAttachmentEntity>);
			var addressPointFrom = !string.IsNullOrWhiteSpace(work.AddressNumberFrom) ? addressNumbers.FirstOrDefault(an => an.Number.Equals(work.AddressNumberFrom)) : default;
			var addressPointTo = !string.IsNullOrWhiteSpace(work.AddressNumberTo) ? addressNumbers.FirstOrDefault(an => an.Number.Equals(work.AddressNumberTo)) : default;

			if (workToUpdate.Address != work.Address)
			{
				var works = await _dbContext.Works.Where(w => w.Year == work.Year && w.Address == work.Address && w.Status != RoadWorkStatus.Deleted).ToListAsync();

				workToUpdate.IsOverlap = works.Count > 0 && !work.IsOverlap || work.IsOverlap;
				workToUpdate.Priority = works.Count > 0 && !work.IsOverlap && !work.Priority.HasValue ? default : work.Priority;

				var filteredWorks = works.Where(w => w.IsOverlap == default)
					.Select(w =>
					{
						w.IsOverlap = true;

						return w;
					})
					.ToList();

				if (filteredWorks.Count > 0)
					_dbContext.Works.UpdateRange(filteredWorks);
			}
			else
			{
				workToUpdate.IsOverlap = work.IsOverlap;
				workToUpdate.Priority = work.Priority;
			}

			workToUpdate.Address = work.Address;
			workToUpdate.AddressNumberFrom = work.AddressNumberFrom;
			workToUpdate.AddressNumberTo = work.AddressNumberTo;
			workToUpdate.AddressPointFrom = addressPointFrom != default ? addressPointFrom.MapPoint.CoordinateToPoint() : default;
			workToUpdate.AddressPointTo = addressPointTo != default ? addressPointTo.MapPoint.CoordinateToPoint() : default;
			workToUpdate.PinPoint = work.PinPoint != default ? work.PinPoint.CoordinateToPoint() : default;
			workToUpdate.GeoFeatureContainer = work.GeoFeatureContainer;
			workToUpdate.Description = work.Description;

			if (_userContext.CompanyId == null)
			{
				workToUpdate.CompanyId = work.CompanyId;
				workToUpdate.EffectiveEndDate = work.EffectiveEndDate;
				workToUpdate.EffectiveStartDate = work.EffectiveStartDate;
				workToUpdate.PublishStatus = work.PublishStatus;
				workToUpdate.Category = work.Category;
				workToUpdate.NotScheduledStatus = work.Category == RoadWorkCategories.NotScheduled && work.NotScheduledStatus.HasValue ? work.NotScheduledStatus.Value : workToUpdate.NotScheduledStatus;
				workToUpdate.VisualizationNotes = work.VisualizationNotes;
				workToUpdate.DescriptionForCitizens = work.DescriptionForCitizens;
				workToUpdate.Link = work.Link;
				workToUpdate.TrafficChangesMeasure = work.TrafficChangesMeasure;
			}

			workToUpdate.EstimatedEndDate = work.EstimatedEndDate;
			workToUpdate.EstimatedStartDate = work.EstimatedStartDate;
			workToUpdate.Neighborhoods = work.Neighborhoods.Select(sm => new RoadWorkNeighborhoodEntity
			{
				NeighborhoodName = sm
			}).ToList();
			workToUpdate.Notes = work.Notes;
			workToUpdate.RoadWays = work.Roadways.Select(s => new RoadWorksRoadwayEntity()
			{
				RoadwayId = s
			}).ToList();
			workToUpdate.Year = work.Year.Value;
			workToUpdate.CompanyReferentName = work.CompanyReferentName;
			workToUpdate.CompanyReferentPhoneNumber = work.CompanyReferentPhoneNumber;
			workToUpdate.MunicipalityReferentName = work.MunicipalityReferentName;
			workToUpdate.MunicipalityReferentPhoneNumber = work.MunicipalityReferentPhoneNumber;
			workToUpdate.SetRoadWorkStatus();

			if (workToUpdate.Category == RoadWorkCategories.Planned && (workToUpdate.EffectiveStartDate.HasValue || workToUpdate.EffectiveEndDate.HasValue))
				workToUpdate.Category = RoadWorkCategories.Scheduled;

			if (workToUpdate.Category != RoadWorkCategories.Planned && !workToUpdate.EstimatedStartDate.HasValue && !workToUpdate.EstimatedEndDate.HasValue && !workToUpdate.EffectiveStartDate.HasValue && !workToUpdate.EffectiveEndDate.HasValue)
				throw new BusinessLogicValidationException(string.Format(Resources.RoadWork_Date_IsMandatory, workToUpdate.Category.Equals(RoadWorkCategories.Scheduled) ? "programmato" : "non programmato"));

			if (workToUpdate.PinPoint == default)
			{
				var geoContainerModel = await GenerateGeoFeatureContainer(work.Address, work.AddressNumberFrom, work.AddressNumberTo);

				workToUpdate.GeoFeatureContainer = geoContainerModel.JsonSerialize(isIntendFormat: false, useCamelCaseConvention: true);
			}

			_dbContext.Works.Update(workToUpdate);

			if (work.Attachments.Count() > 0)
			{
				var ids = work.Attachments.Select(wa => wa.Id);

				var dbAttachments = await _dbContext.Attachments.Where(ae => ids.Contains(ae.Id) && (ae.WorkId == null || ae.WorkId == workToUpdate.Id)).ToListAsync();
				var attachmentsToUpdate = dbAttachments.Join(work.Attachments, ae => ae.Id, wa => wa.Id, (db, wa) => new
				{
					db,
					wa
				}).Select(s =>
				{
					s.db.WorkId = workToUpdate.Id;
					s.db.IsPublic = s.wa.IsPublic;

					return s.db;
				}).Where(ae => ae.WorkId != null).ToList();

				attachmentToDelete = dbAttachments.Except(attachmentsToUpdate, GenericComparer.Create((RoadWorkAttachmentEntity rwae) => rwae.Id)).ToList();

				_dbContext.UpdateRange(attachmentsToUpdate);

				if ((attachmentToDelete?.Count() ?? 0) > 0)
					_dbContext.RemoveRange(attachmentToDelete);
			}

			await _dbContext.AuditWorks.AddAsync(new RoadWorkAuditEntity
			{
				AuditType = AuditTypes.Update,
				DisplayName = _userContext.DisplayName,
				WorkId = workToUpdate.Id,
				LastUpdate = DateTime.UtcNow
			});

			await _dbContext.SaveChangesAsync();

			//TO-DO: da decommentare quando avremo lo spazio azure
			//var lastUpdate = DateTime.UtcNow;

			//await new SystemEvent()
			//{
			//	Payload = workToUpdateSerialized,
			//	Properties = new Dictionary<string, string>
			//			{
			//				{ "ContainerName", _blobContainerName },
			//				{ "StoragePath", $"audit/works/{lastUpdate.ToString("yyyyMMddHHmm")}/{workToUpdate.Id}.json" },
			//				{ "WorkId", workToUpdate.Id.ToString() },
			//				{ "LastUpdate", lastUpdate.ToString() },
			//				{ "DisplayName", _userContext.DisplayName }
			//			}
			//}.SendToTopicAsync("roadworkevents", _serviceBusConnectionString);

			if ((attachmentToDelete?.Count() ?? 0) > 0)
				foreach (var el in attachmentToDelete)
					await _sysEventManager.SendAsync(RoadWorksQueue.CleanStorage, new SystemEventBase()
					{
						Payload = string.Empty,
						Properties = new Dictionary<string, string>
								{
									{ "ContainerName", BlobStorage.RoadWorks.Name },
									{ "StoragePath", el.BlobStoragePath }
								}
					});
		}

		async Task IRoadWorksService.UploadRoadWorkImportData(long companyId, RoadWorkFile importData)
		{
			//importData?.Validate();

			if (importData == default)
				throw new BusinessLogicValidationException("Non è stato specificato nessun contenuto per il file di importazione.");

			if (string.IsNullOrWhiteSpace(importData.Name))
				throw new BusinessLogicValidationException("Non è stato specificato nessun contenuto per il file di importazione.");

			if ((importData.Content?.Length ?? 0) <= 0)
				throw new BusinessLogicValidationException("Non è stato specificato nessun contenuto per il file di importazione.");

			var nameParts = importData.Name.Split('.');
			var extension = nameParts[^1];

			if (!extension.Equals("csv") && !extension.Equals("xls") && !extension.Equals("xlsx"))
				throw new BusinessLogicValidationException(string.Format(Resources.RoadWork_Attachment_InvalidExtension, extension));

			if (string.IsNullOrWhiteSpace(importData.ContentType))
				importData.ContentType = MimeTypes.BinaryData.Code;

			var generatedFileName = $"{Guid.NewGuid()}.{extension}";
			var pathFile = $"imports/{companyId}/{generatedFileName}";

			await _storageManager.UploadFileAsync(BlobStorage.RoadWorks, pathFile, importData.Content, importData.ContentType, generatedFileName);
			await _sysEventManager.SendAsync(RoadWorksQueue.ImportWorks, new SystemEventBase()
			{
				Payload = new ImportQueueElement
				{
					AuthorityId = _userContext.AuthorityId,
					TenantId = _userContext.TenantId,
					CompanyId = companyId,
					ContainerName = BlobStorage.RoadWorks.Name,
					StoragePath = pathFile,
					FileExtension = extension
				}.JsonSerialize(false)
			});
		}

		async Task<RoadWorkAttachmentInfo> IRoadWorksService.UploadAttachment(RoadWorkFile attachment)
		{
			//attachment?.Validate();
			if (attachment == default)
				throw new BusinessLogicValidationException("Non è stato specificato nessun contenuto per l'allegato.");

			if (string.IsNullOrWhiteSpace(attachment.Name))
				throw new BusinessLogicValidationException("Non è stato specificato nessun contenuto per l'allegato.");

			if ((attachment.Content?.Length ?? 0) <= 0)
				throw new BusinessLogicValidationException("Non è stato specificato nessun contenuto per l'allegato.");

			if (string.IsNullOrWhiteSpace(attachment.ContentType))
				attachment.ContentType = MimeTypes.BinaryData.Code;

			var generatedAttachmentName = $"{Guid.NewGuid()}";
			var pathFile = $"attachments/{generatedAttachmentName}";

			await _storageManager.UploadFileAsync(BlobStorage.RoadWorks, pathFile, attachment.Content, attachment.ContentType, generatedAttachmentName);

			var ae = new RoadWorkAttachmentEntity
			{
				BlobStoragePath = pathFile,
				ContentType = attachment.ContentType,
				LastUpdate = DateTime.UtcNow.Date,
				Name = attachment.Name
			};

			await _dbContext.Attachments.AddAsync(ae);
			await _dbContext.SaveChangesAsync();

			return new RoadWorkAttachmentInfo
			{
				Name = attachment.Name,
				IsPublic = false,
				Id = ae.Id,
				ContentType = attachment.ContentType
			};
		}

		async Task<string> IRoadWorksService.DownloadAttachment(long id, bool? isPublic, long? authorityid)
		{
			if (id <= 0)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, Resources.RoadWork_Attachment_NotFound);

			var aId = _userContext?.AuthorityId ?? authorityid ?? 0;
			var query = _dbContext.Attachments.Include(ae => ae.Work).ThenInclude(rwe => rwe.Company).Where(rwe => rwe.Work.AuthorityId == aId);
			var attachment = await (isPublic.HasValue ? query.Where(ae => ae.IsPublic == isPublic) : query).FirstOrDefaultAsync(ae => ae.Id == id);

			if (attachment == default)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, Resources.RoadWork_Attachment_NotFound);

			return (await _storageManager.DownloadFileAsync(BlobStorage.RoadWorks, attachment.BlobStoragePath)).Data;
		}

		async Task<FilterResult<RoadWorkAttachmentInfo>> IRoadWorksService.SearchAttachments(AttachmentsSearchCriteria searchCriteria)
		{
			var sc = searchCriteria ?? new AttachmentsSearchCriteria();
			var query = _dbContext.Attachments.Where(a => !a.WorkId.HasValue || (a.WorkId.HasValue && a.Work.AuthorityId == _userContext.AuthorityId));

			if (sc.Id.HasValue)
				query = query.Where(c => c.Id == sc.Id);

			if (sc.IsPublic.HasValue)
				query = query.Where(c => c.IsPublic == sc.IsPublic);

			if (sc.RoadworkId.HasValue)
				query = query.Where(c => c.WorkId == sc.RoadworkId);

			if (!string.IsNullOrWhiteSpace(sc.Name))
				query = query.Where(c => c.Name == sc.Name);

			var result = await query.OrderAndPageAsync(sc.MapRoadWorkAttachmentOC());

			return new FilterResult<RoadWorkAttachmentInfo>
			{
				Items = result.Items.Select(ce => new RoadWorkAttachmentInfo
				{
					ContentType = ce.ContentType,
					Id = ce.Id,
					IsPublic = ce.IsPublic,
					Name = ce.Name
				}),
				TotalCount = result.TotalCount
			};
		}

		async Task<List<RoadWorkMap>> IRoadWorksService.GetClosestRoadWorks(MapCoordinate point, short? year)
		{
			if (_userContext.CompanyId.HasValue)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.Security);

			point?.Validate();

			//if (point == default)
			//	throw new BusinessLogicValidationException("Coordinata del lavoro obbligatoria");
			//TODO: rendere configurabile per ente il raggio in metri in cui recuperare i lavori vicini.
			var radiusMeters = 5000d;
			var yearToCheck = year ?? DateTime.UtcNow.Year;
			var location = point.CoordinateToPoint();

			return await _dbContext.Works.AsNoTracking()
				.Include(w => w.Company)
				.Include(w => w.Neighborhoods)
				.Include(w => w.RoadWays)
					.ThenInclude(rsr => rsr.Roadway)
				.Where(we => we.AuthorityId == _userContext.AuthorityId && we.Year == yearToCheck && we.Status != RoadWorkStatus.Deleted &&
								we.PinPoint.Distance(location) <= radiusMeters)
				.Select(we => new RoadWorkMap
				{
					Address = we.Address,
					AddressNumberFrom = we.AddressNumberFrom,
					AddressNumberTo = we.AddressNumberTo,
					Category = we.Category,
					CompanyId = we.CompanyId,
					CompanyIsOperationalUnit = we.Company.IsOperationalUnit,
					CompanyName = we.Company.Name,
					CompanyReferentName = we.CompanyReferentName,
					CompanyReferentPhoneNumber = we.CompanyReferentPhoneNumber,
					Description = we.Description,
					EffectiveEndDate = we.EffectiveEndDate,
					EffectiveStartDate = we.EffectiveStartDate,
					EstimatedEndDate = we.EstimatedEndDate,
					EstimatedStartDate = we.EstimatedStartDate,
					GeoFeatureContainer = we.GeoFeatureContainer,
					Id = we.Id,
					PublishStatus = we.PublishStatus,
					Link = we.Link,
					MunicipalityReferentName = we.MunicipalityReferentName,
					MunicipalityReferentPhoneNumber = we.MunicipalityReferentPhoneNumber,
					Neighborhoods = we.Neighborhoods.Select(sm => sm.NeighborhoodName),
					Notes = we.Notes,
					NotScheduledStatus = we.NotScheduledStatus,
					IsOverlap = we.IsOverlap,
					Priority = we.Priority,
					Roadways = we.RoadWays.Select(re => re.Roadway.Name),
					VisualizationNotes = we.VisualizationNotes,
					DescriptionForCitizens = we.DescriptionForCitizens,
					Status = we.Status,
					TrafficChangesMeasure = we.TrafficChangesMeasure,
					Year = we.Year
				}).ToListAsync();
		}

		#region private methods

		async Task<IEnumerable<ValidYear>> GetValidYears()
		{
			var now = DateTime.UtcNow;
			var companyId = _userContext.CompanyId;
			var query = _dbContext.Configurations.AsNoTracking().Where(c => c.AuthorityId == _userContext.AuthorityId);

			if (companyId.HasValue)
				query = query.Where(c => c.SubmissionStartDate <= now && c.SubmissionEndDate >= now);

			return await query.Select(s => new ValidYear { IsDefault = now.Year == s.Year, Year = s.Year }).ToListAsync();
		}

		async Task<List<AddressNumber>> GetAddressNumbers(string addressName)
		{
			var accessToken = await _httpClientFactory.GetClientApplicationToken(_smartPAClientData, _userContext.AuthorityId.ToString(), _userContext.TenantId);
			var addressNumbers = await _placeNameService.GetAddressNumbers(_userContext.AuthorityId, addressName, accessToken);

			return addressNumbers.ToList();
		}

		string ConvertNotPlannedStatusToString(NotScheduledCategoryStatus status)
		{
			return status == NotScheduledCategoryStatus.Approved ? "Approvato" :
				status == NotScheduledCategoryStatus.Authorized ? "Autorizzato" :
				status == NotScheduledCategoryStatus.Proposed ? "Proposto" : "Diniegato/Rinviato";
		}

		async Task<UserInfo> GetUserInfo(Guid? userId)
		{
			if (!userId.HasValue)
				return default;

			var accessToken = await _httpClientFactory.GetClientApplicationToken(_smartPAClientData, _userContext.AuthorityId.ToString(), _userContext.TenantId);
			var user = await _usersService.GetUserInfo(_userContext.AuthorityId, userId.Value, accessToken);

			return user;
		}

		async Task<GeoFeatureContainerMapModel> GenerateGeoFeatureContainer(string address, string addressNumberFrom, string addressNumberTo)
		{
			var keySnc = !string.IsNullOrWhiteSpace(address) ? $"{address}_" : default;
			var keyFrom = !string.IsNullOrWhiteSpace(addressNumberFrom) ? $"{address}_{addressNumberFrom}" : default;
			var keyTo = !string.IsNullOrWhiteSpace(addressNumberTo) ? $"{address}_{addressNumberTo}" : default;
			var addressNumbers = new Dictionary<string, MapCoordinate>();
			var accessToken = await GetClientApplicationToken();
			var smartPAAuthority = await _coreService.GetAuthority(_userContext.AuthorityId, accessToken);

			(await _placeNameService.GetAddressNumbers(_userContext.AuthorityId, address, accessToken))
							.ToLookup(k => $"{address}_{k.Number}", v => v).ToList()
							.ForEach(el => addressNumbers.Add(el.Key, new MapCoordinate
							{
								Latitude = el.First().MapPoint.Latitude,
								Longitude = el.First().MapPoint.Longitude
							}));

			var maxRoadWorksId = (await _dbContext.Works.CountAsync()) > 0 ? await _dbContext.Works.MaxAsync(w => w.Id) : 0;
			var geoContainerModel = new GeoFeatureContainerMapModel
			{
				Center = !string.IsNullOrWhiteSpace(addressNumberFrom) && !string.IsNullOrWhiteSpace(addressNumberTo) ?
										RoadWorksExtensions.CalculatesGeographicMidpoint(addressNumbers.ContainsKey(keyFrom) ? addressNumbers[keyFrom] : default, addressNumbers.ContainsKey(keyTo) ? addressNumbers[keyTo] : default) :
										!string.IsNullOrWhiteSpace(addressNumberFrom) && string.IsNullOrWhiteSpace(addressNumberTo) ?
											addressNumbers.ContainsKey(keyFrom) ? addressNumbers[keyFrom] : default :
											!string.IsNullOrWhiteSpace(address) && addressNumbers.ContainsKey(keySnc) ? addressNumbers[keySnc] :
											!string.IsNullOrWhiteSpace(address) ? await _googleMapsService.GetLocationByAddress(address, smartPAAuthority.Name, null, null, "Italia") :
											default,
				GeoLayers = new List<GeoLayerMapModel>
							{
								new GeoLayerMapModel
								{
									CanBeRemoved = false,
									Id = Guid.NewGuid(),
									Label = "Lavori stradali"
								}
							},
				Id = ++maxRoadWorksId,
				Label = address
			};

			if (!string.IsNullOrWhiteSpace(addressNumberFrom))
				geoContainerModel.Points.Add(new PointMapModel
				{
					Coordinates = addressNumbers.ContainsKey(keyFrom) ? addressNumbers[keyFrom] : default,
					Label = addressNumberFrom
				});

			if (!string.IsNullOrWhiteSpace(addressNumberTo))
				geoContainerModel.Points.Add(new PointMapModel
				{
					Coordinates = addressNumbers.ContainsKey(keyTo) ? addressNumbers[keyTo] : default,
					Label = addressNumberTo
				});

			return geoContainerModel;
		}

		async Task<string> GetClientApplicationToken() =>
			await _httpClientFactory.GetClientApplicationToken(_smartPAClientData, _userContext.AuthorityId.ToString(), _userContext.TenantId);

		#endregion
	}
}