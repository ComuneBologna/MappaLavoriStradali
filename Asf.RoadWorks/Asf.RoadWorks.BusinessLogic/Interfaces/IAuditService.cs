using Asf.RoadWorks.BusinessLogic.Models;
using System.Threading.Tasks;

namespace Asf.RoadWorks.BusinessLogic.Interfaces
{
	/// <summary>
	/// Audit service class
	/// </summary>
	public interface IAuditService
	{
		/// <summary>
		/// Gets the work information.
		/// </summary>
		/// <param name="workId">The work identifier.</param>
		/// <returns></returns>
		Task<RoadWorkAuditInfo> GetWorkInfo(long workId);
	}
}