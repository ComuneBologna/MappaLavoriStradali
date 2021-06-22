using Asf.RoadWorks.BusinessLogic;
using Asf.RoadWorks.BusinessLogic.Interfaces;
using Asf.RoadWorks.BusinessLogic.Models;
using Asf.RoadWorks.DataAccessLayer;
using Asf.RoadWorks.DataAccessLayer.Entities;
using Asf.RoadWorks.Functions.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SmartTech.Common.Enums;
using SmartTech.Common.Extensions;
using SmartTech.Common.Models;
using SmartTech.Common.Services;
using SmartTech.Infrastructure;
using SmartTech.Infrastructure.Exceptions;
using SmartTech.Infrastructure.Extensions;
using SmartTech.Infrastructure.Functions;
using SmartTech.Infrastructure.Maps;
using SmartTech.Infrastructure.Storage;
using SmartTech.Infrastructure.SystemEvents;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Asf.RoadWorks.Functions
{
	public static class Routines
	{
		//readonly IUserContext _userContext;
		//readonly string _blobContainerName;
		//readonly IFileStorage _storageManager;
		//readonly IConfiguration _configuration;
		//readonly IMapsService _googleMapsService;
		//readonly IBackofficeCoreService _coreService;
		//readonly IRoadWorksService _roadworksService;
		//readonly IPlaceNameService _placeNameService;
		//readonly IImportLogService _importLogService;
		//readonly IImportExportService _importService;
		//readonly SmartPAClientData _smartPAClientData;
		//readonly IHttpClientFactory _httpClientFactory;
		//readonly DbContextOptionsBuilder<RoadWorksDbContext> _optionsBuilder;
		static readonly Dictionary<int, string> _propertyNames = new()
		{
			{ 0, "Year" },
			{ 1, "Address" },
			{ 2, "AddressNumberFrom" },
			{ 3, "AddressNumberTo" },
			{ 4, "Description" },
			{ 5, "EstimatedStartDate" },
			{ 6, "EstimatedEndDate" },
			{ 7, "NeighborhoodName" },
			{ 8, "RoadwayName" },
			{ 9, "VisualizationNotes" },
			{ 10, "Note" }
		};

		//public Routines(IRoadWorksService roadworksService, IFileStorage storageManager, IImportLogService importLogService,
		//				IConfiguration configuration, IPlaceNameService placeNameService, IImportExportService importService,
		//				IHttpClientFactory httpClientFactory, IOptions<SmartPAClientData> smartPAClientDataOptions,
		//				IUserContext userContext, IMapsService googleMapsService, IBackofficeCoreService coreService)
		//{
		//	_userContext = userContext;
		//	_coreService = coreService;
		//	_configuration = configuration;
		//	_importService = importService;
		//	_blobContainerName = "roadworks";
		//	_storageManager = storageManager;
		//	_roadworksService = roadworksService;
		//	_importLogService = importLogService;
		//	_placeNameService = placeNameService;
		//	_googleMapsService = googleMapsService;
		//	_httpClientFactory = httpClientFactory;
		//	_smartPAClientData = smartPAClientDataOptions.Value;
		//	_optionsBuilder = new DbContextOptionsBuilder<RoadWorksDbContext>();
		//	_optionsBuilder.UseSqlServer(Environment.GetEnvironmentVariable("RoadWorks:ConnectionString") ?? _configuration["RoadWorks:ConnectionString"], x =>
		//	{
		//		x.UseNetTopologySuite();
		//		x.EnableRetryOnFailure();
		//	});
		//}

		[Function("DeleteUnparentedAttachments")]
		[ServiceBusOutput("clean-storage")]
		public static async Task<List<object>> DeleteUnparentedAttachmentsRun([TimerTrigger("0 0 23 * * *")] TimerInfo timer, FunctionContext executionContext)
		{
			var date = DateTime.UtcNow.AddDays(-2).Date;
			var attachmentsToDelete = default(List<RoadWorkAttachmentEntity>);
			var dbContext = executionContext.GetService<RoadWorksDbContext>();
			var logger = executionContext.GetLogger("DeleteUnparentedAttachments");

			List<object> result = new();

			logger.LogInformation($"C# Timer trigger function executed at: {timer.ScheduleStatus.JsonSerialize()}");
			attachmentsToDelete = await dbContext.Attachments.Where(a => a.WorkId == null && a.LastUpdate <= date).ToListAsync();
			dbContext.RemoveRange(attachmentsToDelete);
			await dbContext.SaveChangesAsync();

			result.AddRange(attachmentsToDelete.Select(a => new SystemEventBase
			{
				Payload = new AttachmentElement
				{
					ContainerName = BlobStorage.RoadWorks.Name,
					StoragePath = a.BlobStoragePath
				}.JsonSerialize(false)
			}).ToList());

			return result;
		}

		[Function("CleanStorage")]
		public static async Task CleanStorageRun([ServiceBusTrigger("clean-storage")] SystemEventBase sysEvent, FunctionContext executionContext)
		{
			var logger = executionContext.GetLogger("CleanStorage");

			try
			{
				var attachmentElement = !string.IsNullOrWhiteSpace(sysEvent?.Payload) ?
					sysEvent.Payload.JsonDeserialize<AttachmentElement>() : default;
				var storagePath = attachmentElement?.StoragePath ??
					throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound);
				var containerName = attachmentElement?.ContainerName ??
					throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound);
				var storageManager = executionContext.GetService<IFileStorage>();

				await storageManager.DeleteFileAsync(BlobStorage.GetContainerByName(containerName), storagePath);
			}
			catch (Exception ex)
			{
				logger.LogError(ex, $"Internal error in CleanStorageRun: {ex.Message}");
				Console.WriteLine($"Internal error in CleanStorageRun [{DateTime.UtcNow}]: {ex.Message}");
			}
		}

		//[Function("AddRoadWorksAudit")]
		//public static async Task AddRoadWorksAuditRun([ServiceBusTrigger("roadworkevents", "audit")] SystemEventBase sysEvent, FunctionContext executionContext)
		//{
		//	var logger = executionContext.GetLogger("AddRoadWorksAudit");

		//	try
		//	{
		//		var result = sysEvent.ToSystemEvent<SystemEventBase>();
		//		var storagePath = result.Properties.ContainsKey("StoragePath") ? result.Properties["StoragePath"] : default;
		//		var containerName = result.Properties.ContainsKey("ContainerName") ? result.Properties["ContainerName"] : default;
		//		var payload = result.Payload;
		//		var workId = result.Properties.ContainsKey("WorkId") ? long.Parse(result.Properties["WorkId"]) : default(long?);
		//		var lastUpdate = result.Properties.ContainsKey("LastUpdate") ? DateTime.Parse(result.Properties["LastUpdate"]) : default(DateTime?);
		//		var displayName = result.Properties.ContainsKey("DisplayName") ? result.Properties["DisplayName"] : default;
		//		var isDeleted = result.Properties.ContainsKey("IsDeleted") && bool.Parse(result.Properties["IsDeleted"]);

		//		BusinessLogicValidation.Validation(() => string.IsNullOrWhiteSpace(storagePath), "Storage path is required.");
		//		BusinessLogicValidation.Validation(() => string.IsNullOrWhiteSpace(containerName), "Container name is required.");
		//		BusinessLogicValidation.Validation(() => !workId.HasValue, "Work id is required.");
		//		BusinessLogicValidation.Validation(() => !lastUpdate.HasValue, "LastUpdate is required.");
		//		BusinessLogicValidation.Validation(() => string.IsNullOrWhiteSpace(displayName), "Display name is required.");

		//		if (!string.IsNullOrWhiteSpace(payload))
		//			using (var stream = new MemoryStream(Encoding.UTF8.GetBytes(payload)))
		//				await _storageManager.UploadFileAsync(BlobStorage.GetContainerByName(containerName), storagePath, stream, MimeTypes.JsonFormat.Code, $"AuditFile_{workId}");

		//		using var context = new RoadWorksDbContext(_optionsBuilder.Options);
		//		await context.AuditWorks.AddAsync(new RoadWorkAuditEntity
		//		{
		//			AuditType = string.IsNullOrWhiteSpace(payload) ? AuditTypes.Create :
		//								isDeleted ? AuditTypes.Delete : AuditTypes.Update,
		//			BlobStoragePath = !string.IsNullOrWhiteSpace(payload) ? storagePath : default,
		//			DisplayName = displayName,
		//			LastUpdate = lastUpdate.Value,
		//			WorkId = workId.Value
		//		});

		//		await context.SaveChangesAsync();
		//	}
		//	catch (Exception ex)
		//	{
		//		logger.LogError(ex, $"Internal error in AddRoadWorksAuditRun: {ex.Message}");
		//		Console.WriteLine($"Internal error in AddRoadWorksAuditRun [{DateTime.UtcNow}]: {ex.Message}");
		//	}
		//}

		[Function("ChangeRoadWorksStatus")]
		public static async Task ChangeRoadWorksStatusRun([TimerTrigger("0 0 23 * * *")] TimerInfo timer, FunctionContext executionContext)
		{
			var dateNow = DateTime.UtcNow;
			var logger = executionContext.GetLogger("OrderedDiscussionFunction");
			var dbContext = executionContext.GetService<RoadWorksDbContext>();

			logger.LogInformation($"C# Timer trigger function executed at: {timer.ScheduleStatus.JsonSerialize()}");

			var roadWorksForChangingStatus = await dbContext.Works
												.Where(we => we.Year == dateNow.Year && we.Status != RoadWorkStatus.Deleted)
												.ToListAsync();

			roadWorksForChangingStatus.ForEach(w => w.SetRoadWorkStatus());

			dbContext.Works.UpdateRange(roadWorksForChangingStatus);
			await dbContext.SaveChangesAsync();
		}

		[Function("ImportRoadWorks")]
		public static async Task ImportRoadWorksRun([ServiceBusTrigger("importworks")] SystemEventBase sysEvent, FunctionContext executionContext)
		{
			var logger = executionContext.GetLogger("ImportRoadWorks");

			try
			{
				var maxRoadWorksId = default(long);
				var excelErrors = new List<RoadWorkError>();
				var roadways = default(Dictionary<string, short>);
				var roadWorksToSave = default(List<RoadWorkWrite>);
				var addressNumbers = new Dictionary<string, MapCoordinate>();
				var importElement = sysEvent.Payload.JsonDeserialize<ImportQueueElement>();
				var authorityId = importElement?.AuthorityId ??
					throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, "authorityId");
				var tenantId = importElement?.TenantId ??
					throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, "tenantId");
				var companyId = importElement?.CompanyId ??
					throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, "companyId");
				var containerName = importElement.ContainerName;
				var storagePath = importElement.StoragePath;
				var fileExtension = importElement.FileExtension;
				var userContext = executionContext.GetService<IUserContext>();

				BusinessLogicValidation.Validation(() => string.IsNullOrWhiteSpace(containerName), "Container name is required.");
				BusinessLogicValidation.Validation(() => string.IsNullOrWhiteSpace(storagePath), "Storage path is required.");
				BusinessLogicValidation.Validation(() => string.IsNullOrWhiteSpace(fileExtension), "File extension is required.");

				((ISettableUserContext)userContext).SetAuthorityId(authorityId);
				((ISettableUserContext)userContext).SetTenantId(tenantId);

				var storageManager = executionContext.GetService<IFileStorage>();
				var httpClientFactory = executionContext.GetService<IHttpClientFactory>();
				var importService = executionContext.GetService<IImportExportService>();
				var smartPAClientData = executionContext.GetService<IOptions<SmartPAClientData>>();
				var placeNameService = executionContext.GetService<IPlaceNameService>();
				var coreService = executionContext.GetService<IBackofficeCoreService>();
				var googleMapsService = executionContext.GetService<IMapsService>();
				var roadworksService = executionContext.GetService<IRoadWorksService>();
				var data = await storageManager.GetBytes(httpClientFactory, BlobStorage.GetContainerByName(containerName), storagePath);
				var excelElements = importService.GetImportModels<ExcelModel>(data, fileExtension.Equals("csv", StringComparison.InvariantCultureIgnoreCase) ? ImportExtensionTypes.CSV : ImportExtensionTypes.Excel, 0, _propertyNames.Select(pn => new FileImportProperty { Name = pn.Value, Position = pn.Key }).ToArray());
				var addresses = excelElements.Select(el => el.Address).ToList();
				var accessToken = await httpClientFactory.GetClientApplicationToken(smartPAClientData.Value, authorityId.ToString(), tenantId);
				var t = await placeNameService.GetNeighborhoods(authorityId, accessToken);
				var neighborhoods = (await placeNameService.GetNeighborhoods(authorityId, accessToken))
					.ToDictionary(n => n.Name.ExtractAlphaNum().ToLower(), n => n.Name);
				var smartPAAuthority = await coreService.GetAuthority(authorityId, accessToken);

				foreach (var address in addresses.Distinct(GenericComparer.Create((string a) => a.ToLower())))
				{
					(await placeNameService.GetAddressNumbers(authorityId, address, accessToken))
						.ToLookup(k => $"{address}_{k.Number}", v => v).ToList()
						.ForEach(el => addressNumbers.Add(el.Key, new MapCoordinate
						{
							Latitude = el.First().MapPoint.Latitude,
							Longitude = el.First().MapPoint.Longitude
						}));
				}

				var dbContext = executionContext.GetService<RoadWorksDbContext>();

				roadways = await dbContext.Roadways.AsNoTracking()
											.ToDictionaryAsync(r => r.Name.ToLower(), r => r.Id);
				maxRoadWorksId = await dbContext.Works.AsNoTracking()
												.Select(w => w.Id).OrderByDescending(id => id)
												.FirstOrDefaultAsync();
				roadWorksToSave = excelElements.Select(ee =>
				{
					var eeMapped = ee.Map(companyId, roadways, neighborhoods);
					var keySnc = !string.IsNullOrWhiteSpace(eeMapped.Address) ? $"{eeMapped.Address}_" : default;
					var keyFrom = !string.IsNullOrWhiteSpace(eeMapped.AddressNumberFrom) ? $"{eeMapped.Address}_{eeMapped.AddressNumberFrom}" : default;
					var keyTo = !string.IsNullOrWhiteSpace(eeMapped.AddressNumberTo) ? $"{eeMapped.Address}_{eeMapped.AddressNumberTo}" : default;
					var geoContainerModel = new GeoFeatureContainerMapModel
					{
						Center = !string.IsNullOrWhiteSpace(eeMapped.AddressNumberFrom) && !string.IsNullOrWhiteSpace(eeMapped.AddressNumberTo) ?
									RoadWorksExtensions.CalculatesGeographicMidpoint(addressNumbers.ContainsKey(keyFrom) ? addressNumbers[keyFrom] : default, addressNumbers.ContainsKey(keyTo) ? addressNumbers[keyTo] : default) :
									!string.IsNullOrWhiteSpace(eeMapped.AddressNumberFrom) && string.IsNullOrWhiteSpace(eeMapped.AddressNumberTo) ?
										addressNumbers.ContainsKey(keyFrom) ? addressNumbers[keyFrom] : default :
											!string.IsNullOrWhiteSpace(eeMapped.Address) && addressNumbers.ContainsKey(keySnc) ? addressNumbers[keySnc] :
											!string.IsNullOrWhiteSpace(eeMapped.Address) ? googleMapsService.GetLocationByAddress(eeMapped.Address, smartPAAuthority.Name, null, null, "Italia").GetAwaiter().GetResult() :
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
						Label = eeMapped.Address
					};

					if (!string.IsNullOrWhiteSpace(eeMapped.AddressNumberFrom))
						geoContainerModel.Points.Add(new PointMapModel
						{
							Coordinates = addressNumbers.ContainsKey(keyFrom) ? addressNumbers[keyFrom] : default,
							Label = eeMapped.AddressNumberFrom
						});

					if (!string.IsNullOrWhiteSpace(eeMapped.AddressNumberTo))
						geoContainerModel.Points.Add(new PointMapModel
						{
							Coordinates = addressNumbers.ContainsKey(keyTo) ? addressNumbers[keyTo] : default,
							Label = eeMapped.AddressNumberTo
						});

					eeMapped.GeoFeatureContainer = geoContainerModel.JsonSerialize(isIntendFormat: false, useCamelCaseConvention: true);

					return eeMapped;
				}).ToList();

				foreach (var w in roadWorksToSave)
					try
					{
						await roadworksService.AddRoadWork(w);
					}
					catch (Exception ex)
					{
						var e = new RoadWorkError(w);

						e.Errors.Add(ex.Message);
						excelErrors.Add(e);
					}

				if (excelErrors.Count > 0)
					await SaveErrorElements(storageManager, executionContext.GetService<IImportLogService>(), excelErrors, companyId);
			}
			catch (Exception ex)
			{
				logger.LogError(ex, $"Internal error in ImportRoadWorksRun: {ex.Message}");
				Console.WriteLine($"Internal error in ImportRoadWorksRun [{DateTime.UtcNow}]: {ex.Message}");
			}
		}

		static async Task SaveErrorElements<T>(IFileStorage storageManager, IImportLogService importLogService, List<T> errorElements, long? companyId)
		{
			var i = 1;
			var migrationDate = DateTime.UtcNow;
			var dirName = $"errors_{migrationDate:yyyyMMdd}";
			var typeName = typeof(T).Name;

			foreach (var elements in errorElements.ChunkBy())
			{
				var jsonFile = elements.JsonSerialize();
				var fileName = $"{typeName}.elements.parts{i++}.json";
				var filePath = $"imports/{companyId ?? 0}/{dirName}/{fileName}";

				await storageManager.UploadFileAsync(BlobStorage.RoadWorks, filePath, new MemoryStream(Encoding.UTF8.GetBytes(jsonFile)), MimeTypes.JsonFormat.Code, fileName);
				await importLogService.AddImportLog(new ImportLogWrite
				{
					CompanyId = companyId ?? 0,
					LogFileName = fileName,
					LogFilePath = filePath,
					MigrationDate = migrationDate
				});
			}
		}
	}
}