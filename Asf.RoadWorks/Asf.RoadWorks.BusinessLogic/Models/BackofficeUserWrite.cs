using SmartTech.Infrastructure.Validations;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	public class BackofficeUserWrite : BackofficeUserBase
	{
		public string RoleCode { get; set; }

		[RequiredIf(nameof(IsOperator))]
		public long? CompanyId { get; set; }

		public bool IsOperator => RoleCode == Roles.RoadWorks_Operator;
	}
}