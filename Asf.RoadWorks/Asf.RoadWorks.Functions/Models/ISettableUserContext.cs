using Asf.RoadWorks.BusinessLogic.Interfaces;
using System;

namespace Asf.RoadWorks.Functions.Models
{
	public interface ISettableUserContext : IUserContext
	{
		public void SetTenantId(Guid tenantId);

		public void SetAuthorityId(long authorityId);

		public void SetCompanyId(long? companyId);
	}
}