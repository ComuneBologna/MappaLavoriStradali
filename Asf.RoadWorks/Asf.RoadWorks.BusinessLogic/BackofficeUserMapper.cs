using Asf.RoadWorks.BusinessLogic.Models;
using Asf.RoadWorks.DataAccessLayer.Entities;
using SmartTech.Common.Models;

namespace Asf.RoadWorks.BusinessLogic
{
	public static class BackofficeUserMapper
	{
		public static BackofficeUserInfo Map(this BaseUserInfo user, CompanyEntity company) =>
			new BackofficeUserInfo
			{
				Id = user.Id,
				Email = user.Email,
				FirstName = user.Name,
				LastName = user.Surname,
				FiscalCode = user.FiscalCode,
				PhoneNumber = user.PhoneNumber,
				CompanyName = company?.Name,
				CompanyId = company?.Id
			};

		public static BackofficeUser Map(this UserInfo user, RoleUserEntity dbUser) =>
			new BackofficeUser
			{
				Id = user.Id,
				PhoneNumber = user.PhoneNumber,
				Email = user.Email,
				FirstName = user.Name,
				LastName = user.Surname,
				FiscalCode = user.FiscalCode,
				RoleCode = dbUser.RoleCode,
				CompanyName = dbUser.Company?.Name,
				CompanyId = dbUser.Company?.Id
			};

		public static User Map(this BackofficeUser user) =>
			new User()
			{
				Email = user.Email,
				Firstname = user.FirstName,
				Surname = user.LastName,
				FiscalCode = user.FiscalCode,
				PhoneNumber = user.PhoneNumber
			};

	}
}