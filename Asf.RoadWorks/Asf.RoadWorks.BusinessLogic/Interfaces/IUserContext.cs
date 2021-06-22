using System;

namespace Asf.RoadWorks.BusinessLogic.Interfaces
{
	/// <summary>
	/// User context interface
	/// </summary>
	public interface IUserContext
	{
		/// <summary>
		/// Gets or sets the tenant identifier.
		/// </summary>
		/// <value>
		/// The tenant identifier.
		/// </value>
		public Guid TenantId { get; }

		/// <summary>
		/// Gets the user identifier.
		/// </summary>
		/// <value>
		/// The user identifier.
		/// </value>
		Guid UserId { get; }

		/// <summary>
		/// Gets the display name.
		/// </summary>
		/// <value>
		/// The display name.
		/// </value>
		string DisplayName { get; }

		/// <summary>
		/// Gets the company identifier.
		/// </summary>
		/// <value>
		/// The company identifier.
		/// </value>
		long? CompanyId { get; }

		/// <summary>
		/// Gets the token.
		/// </summary>
		/// <value>
		/// The token.
		/// </value>
		string AccessToken { get; }

		/// <summary>
		/// Gets or sets the authority identifier.
		/// </summary>
		/// <value>
		/// The authority identifier.
		/// </value>
		public long AuthorityId { get; }
	}
}