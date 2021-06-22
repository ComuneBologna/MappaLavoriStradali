using Asf.RoadWorks.BusinessLogic.Models;
using SmartTech.Infrastructure.Search;
using System.Threading.Tasks;

namespace Asf.RoadWorks.BusinessLogic.Interfaces
{
	/// <summary>
	/// Import log service interface
	/// </summary>
	public interface IImportLogService
	{
		/// <summary>
		/// Searches the import logs.
		/// </summary>
		/// <param name="searchCriteria">The search criteria.</param>
		/// <returns></returns>
		Task<FilterResult<ImportLogRead>> SearchImportLogs(ImportLogsSearchCriteria searchCriteria);

		/// <summary>
		/// Adds the import log.
		/// </summary>
		/// <param name="importLog">The import log.</param>
		/// <returns></returns>
		Task AddImportLog(ImportLogWrite importLog);

		/// <summary>
		/// Downloads the import log.
		/// </summary>
		/// <param name="id">The identifier.</param>
		/// <returns></returns>
		Task<string> DownloadImportLog(long id);
	}
}