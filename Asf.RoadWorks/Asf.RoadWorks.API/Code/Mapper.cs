using Asf.RoadWorks.BusinessLogic.Models;
using System;

namespace Asf.RoadWorks.API.Code
{
	static class Mapper
	{
		public static BackofficeUser Map(this BackofficeUserWrite user, Guid? id = null) =>
			new BackofficeUser
			{
				Email = user.Email,
				FirstName = user.FirstName,
				FiscalCode = user.FiscalCode,
				Id = id ?? default,
				LastName = user.LastName,
				PhoneNumber = user.PhoneNumber,
				RoleCode = user.RoleCode,
				CompanyId = user.CompanyId
			};
	}
}