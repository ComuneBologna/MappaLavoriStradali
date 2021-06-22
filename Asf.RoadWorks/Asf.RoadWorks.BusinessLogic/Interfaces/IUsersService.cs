using Asf.RoadWorks.BusinessLogic.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Asf.RoadWorks.BusinessLogic.Interfaces
{
	public interface IUsersService
	{
		Task<BackofficeUser> AddUser(BackofficeUser user);

		Task<BackofficeUser> EditUser(BackofficeUser user);

		Task DeleteUser(Guid userId);

		Task<IEnumerable<BackofficeUserInfo>> GetUsers();

		Task<BackofficeUser> GetUser(Guid id);
	}
}