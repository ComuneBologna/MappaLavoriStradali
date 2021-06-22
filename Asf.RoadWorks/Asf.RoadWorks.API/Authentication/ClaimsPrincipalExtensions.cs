using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Security.Principal;

namespace Asf.RoadWorks.API.Authentication
{
	static class ClaimsPrincipalExtensions
	{
		public static Guid TenantId(this ClaimsPrincipal principal) => Guid.Parse(principal.FindFirstValue(AuthenticationConstants.TenantId));

		public static string AuthorityId(this ClaimsPrincipal claimsPrincipal) => claimsPrincipal.FindFirstValue(AuthenticationConstants.AuthorityId);

		public static long? CompanyId(this ClaimsPrincipal principal) => principal.Identity.CompanyId();

		public static long? CompanyId(this IIdentity identity) => ((ClaimsIdentity)identity).CompanyId();

		public static long? CompanyId(this ClaimsIdentity identity)
		{
			var claim = identity.FindFirst(AuthenticationConstants.CompanyId);

			return !string.IsNullOrWhiteSpace(claim?.Value) ? (long?)Convert.ToInt64(claim.Value) : null;
		}

		public static Guid UserId(this ClaimsPrincipal principal) => principal.Identity.UserId();

		public static Guid UserId(this IIdentity identity) => ((ClaimsIdentity)identity).UserId();

		public static Guid UserId(this ClaimsIdentity identity)
		{
			var claim = identity.FindFirst(AuthenticationConstants.UserId);

			return new Guid(claim.Value);
		}

		public static void AddClaim(this ClaimsPrincipal claimsPrincipal, string key, string value) =>
			((ClaimsIdentity)claimsPrincipal.Identity).AddClaim(new Claim(key, value));

		public static void AddClaims(this ClaimsPrincipal claimsPrincipal, IEnumerable<Claim> claims) =>
			((ClaimsIdentity)claimsPrincipal.Identity).AddClaims(claims);
	}
}