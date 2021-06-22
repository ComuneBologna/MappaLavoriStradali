using Asf.RoadWorks.BusinessLogic.Interfaces;
using Asf.RoadWorks.BusinessLogic.Localization;
using Asf.RoadWorks.BusinessLogic.Models;
using Asf.RoadWorks.DataAccessLayer;
using Asf.RoadWorks.DataAccessLayer.Entities;
using Microsoft.EntityFrameworkCore;
using SmartTech.Infrastructure.DataAccessLayer.EFCore;
using SmartTech.Infrastructure.Exceptions;
using SmartTech.Infrastructure.Search;
using SmartTech.Infrastructure.Storage;
using SmartTech.Infrastructure.Validations;
using System.Linq;
using System.Threading.Tasks;

namespace Asf.RoadWorks.BusinessLogic
{
	class ImportLogService : IImportLogService
	{
		readonly IUserContext _userContext;
		readonly IFileStorage _storageManager;
		readonly RoadWorksDbContext _dbContext;

		public ImportLogService(RoadWorksDbContext dbContext, IFileStorage storageManager, IUserContext userContext)
		{
			_dbContext = dbContext;
			_userContext = userContext;
			_storageManager = storageManager;
		}

		async Task IImportLogService.AddImportLog(ImportLogWrite importLog)
		{
			if (_userContext.CompanyId.HasValue)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.Security, $"companyId: {_userContext.CompanyId}.");

			importLog?.Validate();
			await _dbContext.ImportLogs.AddAsync(new ImportLogEntity
			{
				CompanyId = importLog.CompanyId.Value,
				LogFileName = importLog.LogFileName,
				LogFilePath = importLog.LogFilePath,
				MigrationDate = importLog.MigrationDate.Value
			});
			await _dbContext.SaveChangesAsync();
		}

		async Task<FilterResult<ImportLogRead>> IImportLogService.SearchImportLogs(ImportLogsSearchCriteria searchCriteria)
		{
			var sc = searchCriteria ?? new ImportLogsSearchCriteria();
			var query = _dbContext.ImportLogs
							.Include(il => il.Company)
							.AsNoTracking()
							.Where(il => il.Company.AuthorityId == _userContext.AuthorityId);

			query = sc.CompanyId.HasValue ? query.Where(q => q.CompanyId == sc.CompanyId) : query;
			query = sc.Id.HasValue ? query.Where(q => q.Id == sc.Id.Value) : query;
			query = sc.MigrationDate.HasValue ? query.Where(q => q.MigrationDate == sc.MigrationDate) : query;

			var sortCriteria = searchCriteria.MapImportLogEntityOC();
			var result = await query.OrderAndPageAsync(new FilterCriteria<ImportLogEntity>()
			{
				ItemsPerPage = searchCriteria.ItemsPerPage,
				PageNumber = searchCriteria.PageNumber,
				SortCriterias = sortCriteria
			});

			return new FilterResult<ImportLogRead>()
			{
				TotalCount = result.TotalCount,
				Items = result.Items.Select(i => new ImportLogRead()
				{
					CompanyId = i.CompanyId,
					CompanyName = i.Company.Name,
					Id = i.Id,
					LogFileName = i.LogFileName,
					LogFilePath = i.LogFilePath,
					MigrationDate = i.MigrationDate
				})
			};
		}

		async Task<string> IImportLogService.DownloadImportLog(long id)
		{
			if (id <= 0)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, Resources.Log_NotFound);

			var log = await _dbContext.ImportLogs
								.Include(rwe => rwe.Company)
								.AsNoTracking()
								.FirstOrDefaultAsync(il => il.Id == id &&
															il.Company.AuthorityId == _userContext.AuthorityId);

			if (log == default)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, Resources.Log_NotFound);

			return (await _storageManager.DownloadFileAsync(BlobStorage.RoadWorks, log.LogFilePath)).Data;
		}
	}
}