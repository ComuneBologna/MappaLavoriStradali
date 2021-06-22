using Asf.RoadWorks.API.Code;
using Asf.RoadWorks.BusinessLogic;
using Asf.RoadWorks.BusinessLogic.Interfaces;
using Asf.RoadWorks.BusinessLogic.Models;
using Microsoft.AspNetCore.Mvc;
using SmartTech.Common.Web.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Asf.RoadWorks.API.Controllers
{
	public class BackofficeUsersController : RoadWorksBaseController
	{
		readonly IUsersService _backofficeUsersService;

		/// <summary>
		/// Initializes a new instance of the <see cref="MembershipController"/> class.
		/// </summary>
		/// <param name="backofficeUsersService">The backoffice user service.</param>
		public BackofficeUsersController(IUsersService backofficeUsersService) => _backofficeUsersService = backofficeUsersService;

		/// <summary>
		/// Adds the person.
		/// </summary>
		/// <param name="user">The user.</param>
		/// <returns></returns>
		[HttpPost("users")]
		[PermissionAuthorize(Roles.RoadWorks_Admin, Roles.Tenant_Admin)]
		public async Task<BackofficeUser> AddBackofficeUser([FromBody] BackofficeUserWrite user) =>
			await _backofficeUsersService.AddUser(user.Map());

		/// <summary>
		/// Edits the person.
		/// </summary>
		/// <param name="id">The user identifier.</param>
		/// <param name="user">The user.</param>
		/// <returns></returns>
		[HttpPut("users/{id}")]
		[PermissionAuthorize(Roles.RoadWorks_Admin, Roles.Tenant_Admin)]
		public async Task<BackofficeUser> EditBackofficeUser(Guid id, [FromBody] BackofficeUserWrite user) =>
			await _backofficeUsersService.EditUser(user.Map(id));

		/// <summary>
		/// Deletes the person.
		/// </summary>
		/// <param name="userId">The username.</param>
		/// <returns></returns>
		[HttpDelete("users/{id}")]
		[PermissionAuthorize(Roles.RoadWorks_Admin, Roles.Tenant_Admin)]
		public async Task DeleteBackofficeUser(Guid id) => await _backofficeUsersService.DeleteUser(id);

		/// <summary>
		/// Get the users.
		/// </summary>
		/// <returns></returns>
		[HttpGet("users")]
		[PermissionAuthorize(Roles.RoadWorks_Admin, Roles.Tenant_Admin)]
		public async Task<IEnumerable<BackofficeUserInfo>> SearchBackofficeUsers() => await _backofficeUsersService.GetUsers();

		/// <summary>
		/// Get the user.
		/// </summary>
		/// <param name="id">The person identifier.</param>
		/// <returns></returns>
		[HttpGet("users/{id}")]
		[PermissionAuthorize(Roles.RoadWorks_Admin, Roles.Tenant_Admin)]
		public async Task<BackofficeUser> GetBackofficeUserById(Guid id) => await _backofficeUsersService.GetUser(id);


		/// <summary>
		/// Get the uses can ben associated to an archive
		/// </summary>
		/// <returns></returns>
		[HttpGet("myroles")]
		[PermissionAuthorize(Roles.Roadworks, Roles.Tenant_Admin)]
		public async Task<IEnumerable<string>> GetMyRoles() =>
			await Task.FromResult(User.Claims.Where(w => w.Type == "permission")
												.Select(s => s.Value).ToList());
	}
}