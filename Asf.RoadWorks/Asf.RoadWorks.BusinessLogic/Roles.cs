using System.Collections.Generic;

namespace Asf.RoadWorks.BusinessLogic
{
	public class Roles
	{
		public const string Roadworks = nameof(Roadworks);
		public const string Tenant_Admin = nameof(Tenant_Admin);
		public const string RoadWorks_Admin = nameof(RoadWorks_Admin);
		public const string RoadWorks_Operator = nameof(RoadWorks_Operator);
		public const string RoadWorks_PressOffice = nameof(RoadWorks_PressOffice);

		public string Code { get; }

		private Roles(string roleCode) => Code = roleCode;

		public static Roles Administrator => new(RoadWorks_Admin);

		public static Roles PressOffice => new(RoadWorks_PressOffice);

		public static Roles Operator => new(RoadWorks_Operator);

		public static Roles SmartPARole => new(Roadworks);

		public static Roles TenantAdmin => new(Tenant_Admin);

		public static IEnumerable<Roles> List = new List<Roles>() { Administrator, PressOffice, Operator };
	}
}