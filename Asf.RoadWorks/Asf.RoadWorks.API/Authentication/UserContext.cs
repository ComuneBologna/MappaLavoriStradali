using Asf.RoadWorks.BusinessLogic.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using System;

namespace Asf.RoadWorks.API.Authentication
{
	internal class UserContext : IUserContext
	{
		readonly IHttpContextAccessor _httpContextAccessor = null;

		public UserContext(IHttpContextAccessor httpContextAccessor) => _httpContextAccessor = httpContextAccessor;

		public Guid TenantId => _httpContextAccessor.HttpContext.User.TenantId();

		public Guid UserId => _httpContextAccessor.HttpContext.User.UserId();

		public string DisplayName => _httpContextAccessor.HttpContext.User.FindFirst("preferred_username")?.Value ?? this.UserId.ToString();

		public long? CompanyId => _httpContextAccessor.HttpContext.User.CompanyId();

		public string AccessToken => _httpContextAccessor.HttpContext.GetTokenAsync("access_token").GetAwaiter().GetResult();

		public long AuthorityId => long.Parse(_httpContextAccessor.HttpContext.User.AuthorityId());
	}
}