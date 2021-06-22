using Asf.RoadWorks.BusinessLogic.Models;
using SmartTech.Infrastructure.Search;
using System.Threading.Tasks;

namespace Asf.RoadWorks.BusinessLogic.Interfaces
{
	/// <summary>
	/// Roadway service interface
	/// </summary>
	public interface IRoadwayService
	{
		/// <summary>
		/// Searches the roadways.
		/// </summary>
		/// <param name="searchCriteria">The search criteria.</param>
		/// <returns></returns>
		Task<FilterResult<Roadway>> SearchRoadways(RoadwaysSearchCriteria searchCriteria);

		/// <summary>
		/// Adds the roadway.
		/// </summary>
		/// <param name="roadway">The roadway.</param>
		/// <returns></returns>
		Task AddRoadway(RoadwayWrite roadway);

		/// <summary>
		/// Updates the company.
		/// </summary>
		/// <param name="id">The identifier.</param>
		/// <param name="roadway">The roadway.</param>
		/// <returns></returns>
		Task UpdateRoadway(short id, RoadwayWrite roadway);

		/// <summary>
		/// Deletes the company.
		/// </summary>
		/// <param name="roadwayId">The roadway identifier.</param>
		/// <returns></returns>
		Task DeleteRoadway(short roadwayId);
	}
}