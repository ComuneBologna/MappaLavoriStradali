using Asf.RoadWorks.BusinessLogic.Interfaces;
using Asf.RoadWorks.BusinessLogic.Localization;
using Asf.RoadWorks.BusinessLogic.Models;
using Asf.RoadWorks.DataAccessLayer;
using Asf.RoadWorks.DataAccessLayer.Entities;
using Microsoft.EntityFrameworkCore;
using SmartTech.Infrastructure.DataAccessLayer.EFCore;
using SmartTech.Infrastructure.Exceptions;
using SmartTech.Infrastructure.Search;
using SmartTech.Infrastructure.Validations;
using System.Linq;
using System.Threading.Tasks;

namespace Asf.RoadWorks.BusinessLogic
{
	class ConfigurationService : IConfigurationService
	{
		readonly IUserContext _userContext;
		readonly RoadWorksDbContext _dbContext;

		public ConfigurationService(RoadWorksDbContext dbContext, IUserContext userContext)
		{
			_dbContext = dbContext;
			_userContext = userContext;
		}

		async Task IConfigurationService.AddConfiguration(ConfigurationWrite configuration)
		{
			if (_userContext.CompanyId.HasValue)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.Security);

			configuration?.Validate();

			var dbConfiguration = await _dbContext.Configurations
													.FirstOrDefaultAsync(c => c.AuthorityId == _userContext.AuthorityId &&
																				c.Year == configuration.Year);

			if (dbConfiguration != default)
				throw new BusinessLogicValidationException(string.Format(Resources.Configuration_AlreadyExists, configuration.Year));

			var configurationToSave = new ConfigurationEntity
			{
				AuthorityId = _userContext.AuthorityId,
				SubmissionEndDate = configuration.SubmissionEndDate.Value,
				SubmissionStartDate = configuration.SubmissionStartDate.Value,
				Year = configuration.Year.Value
			};

			_dbContext.Configurations.Add(configurationToSave);
			await _dbContext.SaveChangesAsync();
		}

		async Task IConfigurationService.DeleteConfiguration(long configurationId)
		{
			if (_userContext.CompanyId.HasValue)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.Security);

			if (configurationId <= 0)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, Resources.Configuration_NotFound);

			var configurationToDelete = await _dbContext.Configurations
												.FirstOrDefaultAsync(we => we.AuthorityId == _userContext.AuthorityId &&
																			we.Id == configurationId);

			if (configurationToDelete == default)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, Resources.Configuration_NotFound);

			_dbContext.Configurations.Remove(configurationToDelete);
			await _dbContext.SaveChangesAsync();
		}

		async Task<FilterResult<Configuration>> IConfigurationService.SearchConfigurations(ConfigurationSearchCriteria searchCriteria)
		{
			if (_userContext.CompanyId.HasValue)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.Security);

			var sc = searchCriteria ?? new ConfigurationSearchCriteria();
			var query = _dbContext.Configurations
							.AsNoTracking()
							.Where(c => c.AuthorityId == _userContext.AuthorityId);

			if (sc.Id.HasValue)
				query = query.Where(c => c.Id == sc.Id.Value);
			else
			{
				if (sc.Year.HasValue)
					query = query.Where(c => c.Year == sc.Year.Value);

				if (sc.SubmissionStartDate.HasValue)
					query = query.Where(c => c.SubmissionStartDate >= sc.SubmissionStartDate.Value);

				if (sc.SubmissionEndDate.HasValue)
					query = query.Where(c => c.SubmissionEndDate <= sc.SubmissionEndDate);
			}

			var result = await query.OrderAndPageAsync(sc.MapRoadWorkConfigurationOC());

			return new FilterResult<Configuration>
			{
				Items = result.Items.Select(ce => new Configuration
				{
					Id = ce.Id,
					SubmissionEndDate = ce.SubmissionEndDate,
					SubmissionStartDate = ce.SubmissionStartDate,
					Year = ce.Year
				}),
				TotalCount = result.TotalCount
			};
		}

		async Task IConfigurationService.UpdateConfiguration(long id, ConfigurationWrite configuration)
		{
			if (_userContext.CompanyId.HasValue)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.Security);

			if (id <= 0)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, Resources.Configuration_NotFound);

			configuration?.Validate();

			var configurationToUpdate = await _dbContext.Configurations
												.FirstOrDefaultAsync(c => c.AuthorityId == _userContext.AuthorityId && c.Id == id);

			if (configurationToUpdate == default)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, Resources.Configuration_NotFound);

			configurationToUpdate.Year = configuration.Year.Value;
			configurationToUpdate.SubmissionEndDate = configuration.SubmissionEndDate.Value;
			configurationToUpdate.SubmissionStartDate = configuration.SubmissionStartDate.Value;

			_dbContext.Configurations.Update(configurationToUpdate);
			await _dbContext.SaveChangesAsync();
		}
	}
}