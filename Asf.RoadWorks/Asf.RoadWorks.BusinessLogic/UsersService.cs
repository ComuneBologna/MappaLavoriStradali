using Asf.RoadWorks.BusinessLogic.Interfaces;
using Asf.RoadWorks.BusinessLogic.Localization;
using Asf.RoadWorks.BusinessLogic.Models;
using Asf.RoadWorks.DataAccessLayer;
using Asf.RoadWorks.DataAccessLayer.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SmartTech.Common.Extensions;
using SmartTech.Common.Models;
using SmartTech.Common.Services;
using SmartTech.Infrastructure.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Asf.RoadWorks.BusinessLogic
{
	class UsersService : Interfaces.IUsersService
	{
		readonly IUserContext _userContext;
		readonly IBackofficeUsersService _boUserService;
		readonly RoadWorksDbContext _dbContext;
		readonly SmartPAClientData _smartPAClientData;
		readonly IHttpClientFactory _httpClientFactory;

		public UsersService(IBackofficeUsersService boUserService, RoadWorksDbContext dbContext, IUserContext userContext,
										IHttpClientFactory httpClientFactory, IOptions<SmartPAClientData> smartPAClientDataOptions)
		{
			_dbContext = dbContext;
			_userContext = userContext;
			_boUserService = boUserService;
			_httpClientFactory = httpClientFactory;
			_smartPAClientData = smartPAClientDataOptions.Value;
		}

		async Task<BackofficeUser> Interfaces.IUsersService.AddUser(BackofficeUser user)
		{
			if (!Roles.List.Select(s => s.Code).Contains(user.RoleCode))
			{
				throw new BusinessLogicValidationException(Resources.InvalidRole);
			}


			var identityUser = user.Map();
			var accessToken = await GetClientApplicationToken();
			var userId = await _boUserService.AddUser(identityUser, accessToken, _userContext.AuthorityId);

			//Vedo se non esiste già
			var existingUser = await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(f => f.UserId == userId && f.AuthorityId == _userContext.AuthorityId);
			if (existingUser != null)
			{
				throw new BusinessLogicValidationException(Resources.UserAlreadyExists); ;
			}
			await _dbContext.Users.AddAsync(new RoleUserEntity
			{
				AuthorityId = _userContext.AuthorityId,
				RoleCode = user.RoleCode,
				UserId = userId,
				CompanyId = (user.RoleCode == Roles.RoadWorks_Admin || user.RoleCode == Roles.RoadWorks_PressOffice) ? null : user.CompanyId
			});
			await _dbContext.SaveChangesAsync();
			user.Id = userId;

			return user;
		}

		async Task<BackofficeUser> Interfaces.IUsersService.EditUser(BackofficeUser user)
		{
			var dbUser = await this._dbContext.Users.FirstOrDefaultAsync(f => f.UserId == user.Id && f.AuthorityId == this._userContext.AuthorityId);
			if (dbUser == default)
			{
				throw new BusinessLogicValidationException(BusinessLogicValidationExceptionScopes.NotFound);
			}
			if (!Roles.List.Select(s => s.Code).Contains(user.RoleCode))
			{
				throw new BusinessLogicValidationException(Resources.InvalidRole);
			}



			var identityUser = user.Map();
			var accessToken = await GetClientApplicationToken();
			await _boUserService.UpdateUser(identityUser, user.Id, accessToken, _userContext.AuthorityId);


			dbUser.RoleCode = user.RoleCode;
			if (user.RoleCode == Roles.RoadWorks_Admin || user.RoleCode == Roles.RoadWorks_PressOffice)
			{
				dbUser.CompanyId = null;
			}
			else
			{
				dbUser.CompanyId = user.CompanyId;
			}

			await _dbContext.SaveChangesAsync();
			return user;
		}

		async Task Interfaces.IUsersService.DeleteUser(Guid userId)
		{
			var accessToken = await GetClientApplicationToken();
			var dbUser = await _dbContext.Users
							.FirstOrDefaultAsync(accessToken => accessToken.UserId == userId &&
													accessToken.AuthorityId == _userContext.AuthorityId);

			if (dbUser != default)
			{
				await _boUserService.DeleteUser(dbUser.UserId, accessToken, _userContext.AuthorityId);
				_dbContext.Users.Remove(dbUser);
				await _dbContext.SaveChangesAsync();
			}
		}

		async Task<IEnumerable<BackofficeUserInfo>> Interfaces.IUsersService.GetUsers()
		{
			var accessToken = await GetClientApplicationToken();
			var users = await _dbContext.Users
									.AsNoTracking()
									.Include(i => i.Company)
									.Where(w => w.AuthorityId == _userContext.AuthorityId)
									.Select(s => new
									{
										s.UserId,
										s.Company
									}).ToListAsync();
			var smartPaUsers = await _boUserService.GetUsersInfo(users.Select(s => s.UserId).ToList(), accessToken);

			return smartPaUsers.OrderBy(o => o.Surname).ThenBy(t => t.Name).Select(s => s.Map(users.First(f => f.UserId == s.Id).Company)).ToList();
		}

		async Task<BackofficeUser> Interfaces.IUsersService.GetUser(Guid id)
		{
			var accessToken = await GetClientApplicationToken();
			var smartPAUser = await _boUserService.GetUserInfo(_userContext.AuthorityId, id, accessToken);
			var dbUser = await this._dbContext.Users.Include(i => i.Company).FirstOrDefaultAsync(f => f.UserId == id && f.AuthorityId == _userContext.AuthorityId);
			return smartPAUser?.Map(dbUser);
		}

		#region private methods

		async Task<string> GetClientApplicationToken() =>
			await _httpClientFactory.GetClientApplicationToken(_smartPAClientData, _userContext.AuthorityId.ToString(), _userContext.TenantId);

		#endregion
	}
}