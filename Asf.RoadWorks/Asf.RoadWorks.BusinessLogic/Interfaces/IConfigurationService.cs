using Asf.RoadWorks.BusinessLogic.Models;
using SmartTech.Infrastructure.Search;
using System.Threading.Tasks;

namespace Asf.RoadWorks.BusinessLogic.Interfaces
{
	/// <summary>
	/// Configuration service interface
	/// </summary>
	public interface IConfigurationService
	{
		/// <summary>
		/// Adds the configuration.
		/// </summary>
		/// <param name="configuration">The configuration.</param>
		/// <returns></returns>
		Task AddConfiguration(ConfigurationWrite configuration);

		/// <summary>
		/// Deletes the configuration.
		/// </summary>
		/// <param name="configurationId">The configuration identifier.</param>
		/// <returns></returns>
		Task DeleteConfiguration(long configurationId);

		/// <summary>
		/// Searches the configurations.
		/// </summary>
		/// <param name="searchCriteria">The search criteria.</param>
		/// <returns></returns>
		Task<FilterResult<Configuration>> SearchConfigurations(ConfigurationSearchCriteria searchCriteria);

		/// <summary>
		/// Updates the configuration.
		/// </summary>
		/// <param name="id">The identifier.</param>
		/// <param name="configuration">The configuration.</param>
		/// <returns></returns>
		Task UpdateConfiguration(long id, ConfigurationWrite configuration);
	}
}