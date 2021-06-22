using Asf.RoadWorks.API.Code;
using Asf.RoadWorks.BusinessLogic;
using Asf.RoadWorks.BusinessLogic.Interfaces;
using Asf.RoadWorks.BusinessLogic.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartTech.Common.Web.Security;
using SmartTech.Infrastructure.Search;
using System.Linq;
using System.Threading.Tasks;

namespace Asf.RoadWorks.API.Controllers
{
	public class RoadwaysController : RoadWorksBaseController
	{
		readonly IRoadwayService _roadwayService;

		public RoadwaysController(IRoadwayService roadwayService) => _roadwayService = roadwayService;

		/// <summary>
		/// Gets the companies.
		/// </summary>
		/// <returns></returns>
		[HttpGet]
		[PermissionAuthorize(Roles.RoadWorks_Admin, Roles.RoadWorks_Operator, Roles.RoadWorks_PressOffice)]
		public async Task<FilterResult<Roadway>> GetRoadways() =>
			await _roadwayService.SearchRoadways(new RoadwaysSearchCriteria
			{
				Ascending = true,
				ItemsPerPage = int.MaxValue,
				KeySelector = nameof(Roadway.Name),
				PageNumber = 1
			});

		/// <summary>
		/// Gets the roadway.
		/// </summary>
		/// <param name="id">The identifier.</param>
		/// <returns></returns>
		[Authorize]
		[HttpGet("{id}")]
		[PermissionAuthorize(Roles.RoadWorks_Admin, Roles.RoadWorks_Operator, Roles.RoadWorks_PressOffice)]
		public async Task<Roadway> GetRoadway(short id) =>
			(await _roadwayService.SearchRoadways(new RoadwaysSearchCriteria { Id = id }))?.Items.FirstOrDefault();

		/// <summary>
		/// Posts the specified roadway.
		/// </summary>
		/// <param name="roadway">The roadway.</param>
		[HttpPost]
		[PermissionAuthorize(Roles.RoadWorks_Admin)]
		public async Task Post([FromBody] RoadwayWrite roadway) => await _roadwayService.AddRoadway(roadway);

		/// <summary>
		/// Puts the specified identifier.
		/// </summary>
		/// <param name="id">The identifier.</param>
		/// <param name="roadway">The roadway.</param>
		[HttpPut("{id}")]
		[PermissionAuthorize(Roles.RoadWorks_Admin)]
		public async Task Put(short id, [FromBody] RoadwayWrite roadway) => await _roadwayService.UpdateRoadway(id, roadway);

		/// <summary>
		/// Deletes the specified identifier.
		/// </summary>
		/// <param name="id">The identifier.</param>
		[HttpDelete("{id}")]
		[PermissionAuthorize(Roles.RoadWorks_Admin)]
		public async Task Delete(short id) => await _roadwayService.DeleteRoadway(id);
	}
}