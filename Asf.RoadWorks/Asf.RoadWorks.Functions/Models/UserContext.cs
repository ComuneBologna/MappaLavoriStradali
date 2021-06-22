using Asf.RoadWorks.BusinessLogic.Interfaces;
using System;

namespace Asf.RoadWorks.Functions.Models
{
	internal class UserContext : IUserContext, ISettableUserContext
	{
		Guid _tenantId;
		long? _companyId;
		long _authorityid;

		public Guid TenantId => _tenantId;

		public Guid UserId => default;

		public string DisplayName => "Backoffice import";

		public long? CompanyId => _companyId;

		public string AccessToken => string.Empty;

		public long AuthorityId => _authorityid;

		void ISettableUserContext.SetAuthorityId(long authorityId) => _authorityid = authorityId;

		void ISettableUserContext.SetCompanyId(long? companyId) => _companyId = companyId;

		void ISettableUserContext.SetTenantId(Guid tenantId) => _tenantId = tenantId;
	}
}