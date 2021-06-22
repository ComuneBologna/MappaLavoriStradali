using Asf.RoadWorks.API.Code;
using Asf.RoadWorks.BusinessLogic;
using Asf.RoadWorks.BusinessLogic.Interfaces;
using Asf.RoadWorks.BusinessLogic.Models;
using Microsoft.AspNetCore.Mvc;
using SmartTech.Common.Web.Security;
using SmartTech.Infrastructure.Search;
using System.Linq;
using System.Threading.Tasks;

namespace Asf.RoadWorks.API.Controllers
{
	public class ConfigurationsController : RoadWorksBaseController
	{
		readonly IConfigurationService _configurationService;

		public ConfigurationsController(IConfigurationService configurationService)
		{
			_configurationService = configurationService;
		}

		/// <summary>
		/// Gets the configurations.
		/// </summary>
		/// <param name="searchCriteria">The search criteria.</param>
		/// <returns></returns>
		[HttpGet]
		[PermissionAuthorize(Roles.RoadWorks_Admin)]
		public async Task<FilterResult<Configuration>> GetConfigurations([FromQuery] ConfigurationSearchCriteria searchCriteria) =>
			await _configurationService.SearchConfigurations(searchCriteria);

		/// <summary>
		/// Gets the configuration.
		/// </summary>
		/// <param name="id">The identifier.</param>
		/// <returns></returns>
		[HttpGet("{id}")]
		[PermissionAuthorize(Roles.RoadWorks_Admin)]
		public async Task<Configuration> GetConfiguration(long id) =>
			(await _configurationService.SearchConfigurations(new ConfigurationSearchCriteria() { Id = id })).Items.FirstOrDefault();

		/// <summary>
		/// Posts the specified configuration.
		/// </summary>
		/// <param name="configuration">The configuration.</param>
		/// <returns></returns>
		[HttpPost]
		[PermissionAuthorize(Roles.RoadWorks_Admin)]
		public async Task Post([FromBody] ConfigurationWrite configuration) =>
			await _configurationService.AddConfiguration(configuration);

		/// <summary>
		/// Puts the specified identifier.
		/// </summary>
		/// <param name="id">The identifier.</param>
		/// <param name="configuration">The configuration.</param>
		/// <returns></returns>
		[HttpPut("{id}")]
		[PermissionAuthorize(Roles.RoadWorks_Admin)]
		public async Task Put(long id, [FromBody] ConfigurationWrite configuration) =>
			await _configurationService.UpdateConfiguration(id, configuration);

		/// <summary>
		/// Deletes the specified identifier.
		/// </summary>
		/// <param name="id">The identifier.</param>
		/// <returns></returns>
		[HttpDelete("{id}")]
		[PermissionAuthorize(Roles.RoadWorks_Admin)]
		public async Task Delete(long id) => await _configurationService.DeleteConfiguration(id);
	}
}