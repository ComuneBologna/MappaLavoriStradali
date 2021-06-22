using Asf.RoadWorks.BusinessLogic;
using Asf.RoadWorks.BusinessLogic.Interfaces;
using Asf.RoadWorks.BusinessLogic.Models;
using Asf.RoadWorks.DataAccessLayer.Entities;
using Microsoft.AspNetCore.Mvc;
using SmartTech.Common.Web.Security;
using SmartTech.Infrastructure.API.Attributes;
using SmartTech.Infrastructure.Search;
using System.Linq;
using System.Threading.Tasks;

namespace Asf.RoadWorks.API.Controllers
{
	/// <summary>
	/// Controller for Press Office
	/// </summary>
	[ApiController]
	[ApiVersion("1.0")]
	[RouteController("{version:apiVersion}", "[controller]")]
	public class PressOfficeController : ControllerBase
	{
		readonly IRoadWorksService _roadWorksService;

		/// <summary>
		/// Initializes a new instance of the <see cref="PressOfficeController" /> class.
		/// </summary>
		/// <param name="roadWorksService">
		/// The road works service.
		/// </param>
		public PressOfficeController(IRoadWorksService roadWorksService) => _roadWorksService = roadWorksService;


		/// <summary>
		/// Gets the specified criteria.
		/// </summary>
		/// <param name="criteria">The criteria.</param>
		/// <returns></returns>
		[HttpGet("roadworks")]
		[PermissionAuthorize(Roles.RoadWorks_PressOffice)]
		public async Task<FilterResult<RoadWork>> Get([FromQuery] RoadWorksFilterCriteria criteria)
		{
			var sc = new RoadWorksSearchCriteria()
			{
				AddressName = criteria.AddressName,
				Categories = criteria.Categories,
				CompanyId = criteria.CompanyId,
				CompanyType = criteria.CompanyType,
				Description = criteria.Description,
				EffectiveEndDateFrom = criteria.EffectiveEndDateFrom,
				EffectiveEndDateTo = criteria.EffectiveEndDateTo,
				EffectiveStartDateFrom = criteria.EffectiveStartDateFrom,
				EffectiveStartDateTo = criteria.EffectiveStartDateTo,
				Id = criteria.Id,
				IsOverlap = criteria.IsOverlap,
				Neighborhood = criteria.Neighborhood,
				NotScheduledStatus = criteria.NotScheduledStatus,
				Ascending = criteria.Ascending,
				KeySelector = criteria.KeySelector,
				ItemsPerPage = criteria.ItemsPerPage,
				PageNumber = criteria.PageNumber,
				Priorities = criteria.Priorities,
				PublishStatus = criteria.PublishStatus.HasValue ?
					criteria.PublishStatus.Value == PublishStatus.Draft ? PublishStatusForSearch.None :
					criteria.PublishStatus.Value == PublishStatus.Approved ? PublishStatusForSearch.Approved :
					criteria.PublishStatus.Value == PublishStatus.WaitingToApprove ? PublishStatusForSearch.WaitingToApprove :
					 PublishStatusForSearch.WaitingToApprove | PublishStatusForSearch.Approved :
					 PublishStatusForSearch.WaitingToApprove | PublishStatusForSearch.Approved,
				RoadwayName = criteria.RoadwayName,
				Status = criteria.Status,
				VisibleType = criteria.VisibleType,
				YearFrom = criteria.YearFrom,
				YearTo = criteria.YearTo
			};

			return await _roadWorksService.SearchRoadWorks<RoadWork>(sc);
		}

		/// <summary>
		/// Puts the Visualization Notes and publish status.
		/// </summary>
		/// <param name="id">The identifier.</param>
		/// <param name="roadWork">The road work.</param>
		[HttpPut("roadworks/{id}")]
		[PermissionAuthorize(Roles.RoadWorks_PressOffice)]
		public async Task Put(long id, [FromBody] RoadWorkUpdate roadWork)
		{
			var dbRoadwork = (await _roadWorksService.SearchRoadWorks<RoadWorkDetail>(new RoadWorksSearchCriteria() { Id = id })).Items.FirstOrDefault();

			if (dbRoadwork != default)
			{
				roadWork.Address = dbRoadwork.Address;
				roadWork.AddressNumberFrom = dbRoadwork.AddressNumberFrom;
				roadWork.AddressNumberTo = dbRoadwork.AddressNumberTo;
				roadWork.Attachments = dbRoadwork.Attachments;
				roadWork.Category = dbRoadwork.Category;
				roadWork.CompanyId = dbRoadwork.CompanyId;
				roadWork.CompanyReferentName = dbRoadwork.CompanyReferentName;
				roadWork.CompanyReferentPhoneNumber = dbRoadwork.CompanyReferentPhoneNumber;
				roadWork.Description = dbRoadwork.Description;
				roadWork.EffectiveEndDate = dbRoadwork.EffectiveEndDate;
				roadWork.EffectiveStartDate = dbRoadwork.EffectiveStartDate;
				roadWork.EstimatedEndDate = dbRoadwork.EstimatedEndDate;
				roadWork.EstimatedStartDate = dbRoadwork.EstimatedStartDate;
				roadWork.GeoFeatureContainer = dbRoadwork.GeoFeatureContainer;
				roadWork.IsOverlap = dbRoadwork.IsOverlap;
				roadWork.Link = dbRoadwork.Link;
				roadWork.MunicipalityReferentName = dbRoadwork.MunicipalityReferentName;
				roadWork.MunicipalityReferentPhoneNumber = dbRoadwork.MunicipalityReferentPhoneNumber;
				roadWork.Neighborhoods = dbRoadwork.Neighborhoods;
				roadWork.Notes = dbRoadwork.Notes;
				roadWork.NotScheduledStatus = dbRoadwork.NotScheduledStatus;
				roadWork.PinPoint = dbRoadwork.PinPoint;
				roadWork.Priority = dbRoadwork.Priority;
				roadWork.Roadways = dbRoadwork.Roadways.Select(a => a.Id).ToList();
				roadWork.Year = dbRoadwork.Year;

				await _roadWorksService.UpdateRoadWork(id, roadWork);
			}
		}

		[HttpGet("roadworks/map")]
		[PermissionAuthorize(Roles.RoadWorks_PressOffice)]
		public async Task<FilterResult<RoadWorkMap>> GetRoadWorkForMap([FromQuery] RoadWorksFilterCriteria criteria)
		{
			var sc = new RoadWorksSearchCriteria()
			{
				AddressName = criteria.AddressName,
				Categories = criteria.Categories,
				CompanyId = criteria.CompanyId,
				CompanyType = criteria.CompanyType,
				Description = criteria.Description,
				EffectiveEndDateFrom = criteria.EffectiveEndDateFrom,
				EffectiveEndDateTo = criteria.EffectiveEndDateTo,
				EffectiveStartDateFrom = criteria.EffectiveStartDateFrom,
				EffectiveStartDateTo = criteria.EffectiveStartDateTo,
				Id = criteria.Id,
				IsOverlap = criteria.IsOverlap,
				Neighborhood = criteria.Neighborhood,
				NotScheduledStatus = criteria.NotScheduledStatus,
				Ascending = criteria.Ascending,
				KeySelector = criteria.KeySelector,
				ItemsPerPage = criteria.ItemsPerPage,
				PageNumber = criteria.PageNumber,
				Priorities = criteria.Priorities,
				PublishStatus = criteria.PublishStatus.HasValue ?
					criteria.PublishStatus.Value == PublishStatus.Draft ? PublishStatusForSearch.None :
					criteria.PublishStatus.Value == PublishStatus.Approved ? PublishStatusForSearch.Approved :
					criteria.PublishStatus.Value == PublishStatus.WaitingToApprove ? PublishStatusForSearch.WaitingToApprove :
					 PublishStatusForSearch.WaitingToApprove | PublishStatusForSearch.Approved :
					 PublishStatusForSearch.WaitingToApprove | PublishStatusForSearch.Approved,
				RoadwayName = criteria.RoadwayName,
				Status = criteria.Status,
				VisibleType = criteria.VisibleType,
				YearFrom = criteria.YearFrom,
				YearTo = criteria.YearTo
			};

			return await _roadWorksService.SearchRoadWorks<RoadWorkMap>(sc);
		}
	}
}