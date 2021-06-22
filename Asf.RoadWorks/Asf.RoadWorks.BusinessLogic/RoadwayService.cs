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
	class RoadwayService : IRoadwayService
	{
		readonly IUserContext _userContext;
		readonly RoadWorksDbContext _dbContext;

		public RoadwayService(RoadWorksDbContext dbContext, IUserContext userContext)
		{
			_dbContext = dbContext;
			_userContext = userContext;
		}

		async Task IRoadwayService.AddRoadway(RoadwayWrite roadway)
		{
			if (_userContext.CompanyId.HasValue)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.Security);

			roadway?.Validate();

			if (_dbContext.Roadways.Any(r => r.Name == roadway.Name))
				throw new BusinessLogicValidationException(string.Format(Resources.Roadway_AlreadyExists, roadway.Name));

			_dbContext.Roadways.Add(new RoadwayEntity
			{
				Name = roadway.Name
			});

			await _dbContext.SaveChangesAsync();
		}

		async Task IRoadwayService.DeleteRoadway(short roadwayId)
		{
			if (_userContext.CompanyId.HasValue)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.Security);

			if (roadwayId <= 0)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, Resources.Roadway_NotFound);

			if (_dbContext.Roadways.Any(rw => rw.RoadWorksRoadways.Any(rwr => rwr.RoadwayId == roadwayId)))
				throw new BusinessLogicValidationException(string.Format(Resources.Roadway_WorksExist_NotDeleted, roadwayId));

			var r = await _dbContext.Roadways.FirstOrDefaultAsync(re => re.Id == roadwayId);

			if (r == default)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, Resources.Roadway_NotFound);

			_dbContext.Roadways.Remove(r);
			await _dbContext.SaveChangesAsync();
		}

		async Task<FilterResult<Roadway>> IRoadwayService.SearchRoadways(RoadwaysSearchCriteria searchCriteria)
		{
			var sc = searchCriteria ?? new RoadwaysSearchCriteria();
			var query = _dbContext.Roadways.AsQueryable();

			if (sc.Id.HasValue)
				query = query.Where(r => r.Id == sc.Id.Value);
			else if (!string.IsNullOrWhiteSpace(sc.Name))
				query = query.Where(r => r.Name.Contains(sc.Name));

			var result = await query.OrderAndPageAsync(sc.MapRoadwayOC());

			return new FilterResult<Roadway>
			{
				Items = result.Items.Select(re => new Roadway
				{
					Id = re.Id,
					Name = re.Name
				}),
				TotalCount = result.TotalCount
			};
		}

		async Task IRoadwayService.UpdateRoadway(short id, RoadwayWrite roadway)
		{
			if (_userContext.CompanyId.HasValue)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.Security);

			if (id <= 0)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, Resources.Roadway_NotFound);

			roadway?.Validate();

			if (_dbContext.Roadways.AsNoTracking().Any(re => re.Name == roadway.Name && re.Id != id))
				throw new BusinessLogicValidationException(Resources.Roadway_AlreadyExists);

			var r = await _dbContext.Roadways.FirstOrDefaultAsync(re => re.Id == id);

			if (r == default)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, Resources.Roadway_NotFound);

			r.Name = roadway.Name;
			_dbContext.Roadways.Update(r);
			await _dbContext.SaveChangesAsync();
		}
	}
}