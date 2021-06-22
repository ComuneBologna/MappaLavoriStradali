using Asf.RoadWorks.API.Code;
using Asf.RoadWorks.API.Models;
using Asf.RoadWorks.BusinessLogic;
using Asf.RoadWorks.BusinessLogic.Interfaces;
using Asf.RoadWorks.BusinessLogic.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartTech.Common.Models;
using SmartTech.Common.Services;
using SmartTech.Common.Web.Security;
using SmartTech.Infrastructure;
using SmartTech.Infrastructure.Extensions;
using SmartTech.Infrastructure.Maps;
using SmartTech.Infrastructure.Search;
using SmartTech.Infrastructure.Storage;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Asf.RoadWorks.API.Controllers
{

	public class RoadWorksController : RoadWorksBaseController
	{
		readonly IUserContext _userContext;
		readonly IAuditService _auditService;
		readonly IFileStorage _storageManager;
		readonly IRoadWorksService _roadWorksService;
		readonly IImportLogService _importLogService;
		readonly IImportExportService _exportService;

		public RoadWorksController(IRoadWorksService roadWorksService, IAuditService auditService, IFileStorage storageManager,
									IUserContext userContext, IImportLogService importLogService,
									IImportExportService exportService)
		{
			_userContext = userContext;
			_auditService = auditService;
			_exportService = exportService;
			_storageManager = storageManager;
			_importLogService = importLogService;
			_roadWorksService = roadWorksService;
		}

		/// <summary>
		/// Gets the specified criteria.
		/// </summary>
		/// <param name="criteria">The criteria.</param>
		/// <returns></returns>
		[HttpGet]
		[PermissionAuthorize(Roles.RoadWorks_Admin, Roles.RoadWorks_Operator, Roles.RoadWorks_PressOffice)]
		public async Task<FilterResult<RoadWork>> Get([FromQuery] RoadWorksSearchCriteria criteria) =>
			await _roadWorksService.SearchRoadWorks<RoadWork>(criteria);

		/// <summary>
		/// Gets the specified criteria.
		/// </summary>
		/// <param name="criteria">The criteria.</param>
		/// <returns></returns>
		[HttpGet("map")]
		[PermissionAuthorize(Roles.RoadWorks_Admin, Roles.RoadWorks_Operator, Roles.RoadWorks_PressOffice)]
		public async Task<FilterResult<RoadWorkMap>> GetRoadWorkForMap([FromQuery] RoadWorksSearchCriteria criteria) =>
			await _roadWorksService.SearchRoadWorks<RoadWorkMap>(criteria);

		/// <summary>
		/// Gets the road works for citizens.
		/// </summary>
		/// <returns></returns>
		[HttpGet("citizens")]
		public async Task<IEnumerable<RoadWorkMap>> GetRoadWorksForCitizens([FromHeader] long authorityId) => await _roadWorksService.GetRoadWorksForCitizens(authorityId);

		/// <summary>
		/// Downloads the attachments for citizens.
		/// </summary>
		/// <param name="id">The identifier.</param>
		/// <returns></returns>
		[HttpGet("citizens/attachments/{id}")]
		public async Task<string> DownloadAttachmentsForCitizens([FromHeader] long authorityId, long id) => await _roadWorksService.DownloadAttachment(id, true, authorityId);

		/// <summary>
		/// Gets the years.
		/// </summary>
		/// <returns></returns>
		[HttpGet("years")]
		[PermissionAuthorize(Roles.RoadWorks_Admin, Roles.RoadWorks_Operator, Roles.RoadWorks_PressOffice)]
		public async Task<IEnumerable<ValidYear>> GetYears() => (await _roadWorksService.GetAvalaibleYears()).OrderByDescending(o => o.Year);

		/// <summary>
		/// Gets the specified identifier.
		/// </summary>
		/// <param name="id">The identifier.</param>
		/// <returns></returns>
		[HttpGet("{id}")]
		[PermissionAuthorize(Roles.RoadWorks_Admin, Roles.RoadWorks_Operator, Roles.RoadWorks_PressOffice)]
		public async Task<RoadWorkDetail> Get(long id) =>
			(await _roadWorksService.SearchRoadWorks<RoadWorkDetail>(new RoadWorksSearchCriteria
			{
				CompanyId = _userContext.CompanyId,
				Id = id
			})).Items.FirstOrDefault();

		/// <summary>
		/// Uploads the road work import data.
		/// </summary>
		/// <param name="companyId">The company identifier.</param>
		/// <param name="file">The file.</param>
		/// <returns></returns>
		[HttpPost("upload/{companyId}")]
		[PermissionAuthorize(Roles.RoadWorks_Admin)]
		public async Task UploadRoadWorkImportData(long companyId, [FromForm] IFormFile file)
		{
			var attachment = new RoadWorkFile
			{
				Content = file.OpenReadStream(),
				ContentType = file.ContentType,
				Name = file.FileName
			};

			await _roadWorksService.UploadRoadWorkImportData(companyId, attachment);
		}

		/// <summary>
		/// Posts the specified road work.
		/// </summary>
		/// <param name="roadWork">The road work.</param>
		[HttpPost]
		[PermissionAuthorize(Roles.RoadWorks_Admin, Roles.RoadWorks_Operator)]
		public async Task Post([FromBody] RoadWorkWrite roadWork) => await _roadWorksService.AddRoadWork(roadWork);

		/// <summary>
		/// Puts the specified identifier.
		/// </summary>
		/// <param name="id">The identifier.</param>
		/// <param name="roadWork">The road work.</param>
		[HttpPut("{id}")]
		[PermissionAuthorize(Roles.RoadWorks_Admin, Roles.RoadWorks_Operator)]
		public async Task Put(long id, [FromBody] RoadWorkUpdate roadWork) => await _roadWorksService.UpdateRoadWork(id, roadWork);

		/// <summary>
		/// Deletes the specified identifier.
		/// </summary>
		/// <param name="id">The identifier.</param>
		[HttpDelete("{id}")]
		[PermissionAuthorize(Roles.RoadWorks_Admin, Roles.RoadWorks_Operator)]
		public async Task Delete(long id) => await _roadWorksService.DeleteRoadWork(id);

		/// <summary>
		/// Exportses the works CSV.
		/// </summary>
		/// <param name="searchCriteria">The search criteria.</param>
		/// <param name="excel">if set to <c>true</c> [excel].</param>
		/// <returns></returns>
		[HttpGet("csv/export")]
		[PermissionAuthorize(Roles.RoadWorks_Admin)]
		public async Task<string> ExportsWorksCSV([FromQuery] RoadWorksSearchCriteria searchCriteria) =>
			await ExportWorks(searchCriteria);

		/// <summary>
		/// Uploads the attachment.
		/// </summary>
		/// <param name="file">The attachment.</param>
		/// <returns></returns>
		[HttpPost("attachments")]
		[PermissionAuthorize(Roles.RoadWorks_Admin)]
		public async Task<RoadWorkAttachmentInfo> UploadAttachment([FromForm] IFormFile file)
		{
			var attachment = new RoadWorkFile
			{
				Content = file.OpenReadStream(),
				ContentType = file.ContentType,
				Name = file.FileName
			};

			return await _roadWorksService.UploadAttachment(attachment);
		}

		/// <summary>
		/// Downloads the attachments.
		/// </summary>
		/// <param name="id">The identifier.</param>
		/// <returns></returns>
		[HttpGet("attachments/{id}")]
		[PermissionAuthorize(Roles.RoadWorks_Admin, Roles.RoadWorks_PressOffice)]
		public async Task<string> DownloadAttachments(long id) => await _roadWorksService.DownloadAttachment(id);

		/// <summary>
		/// Gets the attachments.
		/// </summary>
		/// <param name="criteria">The criteria.</param>
		/// <returns></returns>
		[HttpGet("attachments")]
		[PermissionAuthorize(Roles.RoadWorks_Admin, Roles.RoadWorks_PressOffice)]
		public async Task<FilterResult<RoadWorkAttachmentInfo>> GetAttachments([FromQuery] AttachmentsSearchCriteria criteria) =>
			await _roadWorksService.SearchAttachments(criteria);

		/// <summary>
		/// Gets the road work audit information.
		/// </summary>
		/// <param name="workId">The work identifier.</param>
		/// <returns></returns>
		[HttpGet("audit/{workId}")]
		[PermissionAuthorize(Roles.RoadWorks_Admin)]
		public async Task<RoadWorkAuditInfo> GetRoadWorkAuditInfo(long workId) => await _auditService.GetWorkInfo(workId);

		/// <summary>
		/// Get all the road works within 5 km.
		/// </summary>
		/// <param name="criteria">The criteria.</param>
		/// <returns></returns>
		[HttpGet("ClosestWorks")]
		[PermissionAuthorize(Roles.RoadWorks_Admin)]
		public async Task<IEnumerable<RoadWorkMap>> GetClosestRoadWorks([FromQuery] ClosestRoadWorksSearchCriteria criteria) =>
			await _roadWorksService.GetClosestRoadWorks(new MapCoordinate
			{
				Latitude = criteria.Latitude,
				Longitude = criteria.Longitude
			}, criteria.Year);

		/// <summary>
		/// Downloads the import log.
		/// </summary>
		/// <param name="id">The identifier.</param>
		/// <returns></returns>
		[HttpGet("import/logs/{id}")]
		[PermissionAuthorize(Roles.RoadWorks_Admin)]
		public async Task<string> DownloadImportLog(long id) => await _importLogService.DownloadImportLog(id);

		/// <summary>
		/// Searches the import logs.
		/// </summary>
		/// <param name="searchCriteria">The search criteria.</param>
		/// <returns></returns>
		[HttpGet("import/logs")]
		[PermissionAuthorize(Roles.RoadWorks_Admin)]
		public async Task<FilterResult<ImportLogModel>> SearchImportLogs([FromQuery] ImportLogsSearchCriteria searchCriteria)
		{
			var items = await _importLogService.SearchImportLogs(searchCriteria);

			return new FilterResult<ImportLogModel>
			{
				TotalCount = items.TotalCount,
				Items = items.Items.Select(r => new ImportLogModel
				{
					CompanyName = r.CompanyName,
					FileName = r.LogFileName,
					Id = r.Id,
					MigrationDate = r.MigrationDate.Value
				})
			};
		}

		#region Private methods

		async Task<string> ExportWorks(RoadWorksSearchCriteria searchCriteria = null)
		{
			searchCriteria ??= new();
			searchCriteria.ItemsPerPage = int.MaxValue;
			searchCriteria.PageNumber = 1;

			var wta = (await _roadWorksService.SearchRoadWorks<RoadWorkInfo>(searchCriteria)).Items;
			var roadworksToExport = wta.Select(w => new RoadworkForExcel()
			{
				Ditta = w.CompanyName,
				Referente = $"{w.PersonSurname} {w.PersonName} (email: {w.PersonEmail})",
				Indirizzo = w.AddressName,
				CivicoAl = w.AddressNumberTo,
				CivicoDal = w.AddressNumberFrom,
				NoteLocalizzazione = w.VisualizationNotes,
				Quartiere = string.Join(',', w.Neighborhoods),
				TipoIntervento = w.CategoryName,
				StatoLavoroNonProgrammato = w.NotPlannedStatus,
				DescrizioneLavoro = w.Description,
				Note = w.Notes,
				DataInizioLavori = w.StartDate.ToTimeZoneTime()?.ToString("dd/MM/yyyy"),
				DataFineLavori = w.EndDate.ToTimeZoneTime()?.ToString("dd/MM/yyyy"),
				Sovrapposizione = w.IsOverlap ? "Sì" : "No",
				Sede = string.Join(',', w.RoadWays)
			}).Cast<object>().ToList();

			var configs = new List<ExportConfiguration>
			{
				new ExportConfiguration()
				{
					AutoAdjustColumns = true,
					ExcelHeaderText = new string[] { "Ditta", "Referente", "Indirizzo","Civico Dal","Civico al","Note Localizzazione ","Quartiere", "Tipo Intervento", "Stato del lavoro non programmato", "Descrizione lavoro", "Note", "Data inizio lavori", "Data fine lavori", "Sovrapposizione", "Sede" },
					FirstColumnStartIndex = 1,
					FirstRowStartIndex = 1,
					GetAllBorders = true,
					GetDataTable = true,
					GetHeader = true,
					GetHeaderFromClass = false,
					HeaderBold = true,
					HeaderFontSize = 14,
					WoorkSheetName = "Lavori Stradali",
					RenderList = roadworksToExport,
				}
			};

			var workbook = _exportService.GetExportBytes(configs);
			using var stream = new MemoryStream(workbook);
			var fileName = $"LavoriStradali_{_userContext.AuthorityId}_{DateTime.Now:yyyyMMddHHmmss}.xlsx";
			var pathFile = $"Export/{wta.FirstOrDefault()?.Year ?? 0}/{fileName}";

			await _storageManager.UploadFileAsync(BlobStorage.RoadWorks, pathFile, stream, MimeTypes.MicrosoftOfficeOOXMLSpreadsheet.Code, fileName);

			return (await _storageManager.DownloadFileAsync(BlobStorage.RoadWorks, pathFile)).Data;

		}

		#endregion
	}
}