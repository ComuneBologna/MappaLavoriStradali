using Asf.RoadWorks.BusinessLogic.Interfaces;
using Asf.RoadWorks.BusinessLogic.Localization;
using Asf.RoadWorks.BusinessLogic.Models;
using Asf.RoadWorks.DataAccessLayer;
using Microsoft.EntityFrameworkCore;
using SmartTech.Infrastructure.Exceptions;
using System.Linq;
using System.Threading.Tasks;

namespace Asf.RoadWorks.BusinessLogic
{
	class AuditService : IAuditService
	{
		readonly IUserContext _userContext;
		readonly RoadWorksDbContext _dbContext;

		public AuditService(RoadWorksDbContext dbContext, IUserContext userContext)
		{
			_dbContext = dbContext;
			_userContext = userContext;
		}

		async Task<RoadWorkAuditInfo> IAuditService.GetWorkInfo(long workId)
		{
			if (_userContext.CompanyId.HasValue)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.Security);

			var audit = await _dbContext.AuditWorks
				.AsNoTracking()
				.Where(aw => aw.WorkId == workId)
				.OrderBy(aw => aw.LastUpdate).ToListAsync();

			if ((audit?.Count ?? 0) <= 0)
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound, string.Format(Resources.Audit_NotFound, workId));

			var firstElement = audit.First();
			var lastElement = audit.Last();

			return new RoadWorkAuditInfo
			{
				CreatedAt = firstElement?.LastUpdate,
				CreatedBy = firstElement?.DisplayName,
				LastUpdate = lastElement?.LastUpdate,
				UpdatedBy = lastElement?.DisplayName
			};
		}
	}
}