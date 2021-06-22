using Asf.RoadWorks.BusinessLogic.Models;
using SmartTech.Infrastructure.Maps;
using SmartTech.Infrastructure.Search;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Asf.RoadWorks.BusinessLogic.Interfaces
{
	/// <summary>
	/// Road works service interface.
	/// </summary>
	public interface IRoadWorksService
	{
		/// <summary>
		/// Searches the road works.
		/// </summary>
		/// <param name="searchCriteria">The search criteria.</param>
		/// <returns></returns>
		Task<FilterResult<T>> SearchRoadWorks<T>(RoadWorksSearchCriteria searchCriteria) where T : RoadWorkBase;

		/// <summary>
		/// Gets the road works for citizens.
		/// </summary>
		/// <returns></returns>
		Task<List<RoadWorkMap>> GetRoadWorksForCitizens(long authorityId);

		/// <summary>
		/// Gets the avalaible years.
		/// </summary>
		/// <returns></returns>
		Task<IEnumerable<ValidYear>> GetAvalaibleYears();

		/// <summary>
		/// Deletes the road work.
		/// </summary>
		/// <param name="workId">The work identifier.</param>
		/// <returns></returns>
		Task DeleteRoadWork(long workId);

		/// <summary>
		/// Adds the road work.
		/// </summary>
		/// <param name="work">The work.</param>
		/// <returns></returns>
		Task AddRoadWork(RoadWorkWrite work);

		/// <summary>
		/// Updates the road work.
		/// </summary>
		/// <param name="id">The identifier.</param>
		/// <param name="work">The work.</param>
		/// <returns></returns>
		Task UpdateRoadWork(long id, RoadWorkUpdate work);

		/// <summary>
		/// Uploads the road work import data.
		/// </summary>
		/// <param name="importData">The import data.</param>
		/// <returns></returns>
		Task UploadRoadWorkImportData(long companyId, RoadWorkFile importData);

		/// <summary>
		/// Uploads the attachment.
		/// </summary>
		/// <param name="attachment">The attachment.</param>
		/// <returns></returns>
		Task<RoadWorkAttachmentInfo> UploadAttachment(RoadWorkFile attachment);

		/// <summary>
		/// Downloads the attachment.
		/// </summary>
		/// <param name="id">The identifier.</param>
		/// <param name="isPublic">The is public.</param>
		/// <returns></returns>
		Task<string> DownloadAttachment(long id, bool? isPublic = default, long? authorityid = default);

		/// <summary>
		/// Searches the attachments.
		/// </summary>
		/// <param name="searchCriteria">The search criteria.</param>
		/// <returns></returns>
		Task<FilterResult<RoadWorkAttachmentInfo>> SearchAttachments(AttachmentsSearchCriteria searchCriteria);

		/// <summary>
		/// Gets the closest road works for citizens.
		/// </summary>
		/// <param name="point">The point.</param>
		/// <returns></returns>
		Task<List<RoadWorkMap>> GetClosestRoadWorks(MapCoordinate point, short? year = default);
	}
}