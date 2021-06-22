using System;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	public class BackofficeUserInfo : BackofficeUserBase
	{
		public Guid Id { get; set; }

		public long? CompanyId { get; set; }

		public string CompanyName { get; set; }
	}
}