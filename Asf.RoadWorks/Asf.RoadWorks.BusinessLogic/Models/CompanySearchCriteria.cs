using SmartTech.Infrastructure.Search;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	/// <summary>
	/// Company search criteria class
	/// </summary>
	/// <seealso cref="Asf.PublicApps.Infrastructure.Models.SearchCriteria{Asf.RoadWorks.BusinessLogic.Models.Company}" />
	public class CompanySearchCriteria : FilterCriteria
	{
		/// <summary>
		/// Gets or sets the identifier.
		/// </summary>
		/// <value>
		/// The identifier.
		/// </value>
		public long? Id { get; set; }

		/// <summary>
		/// Gets or sets the is operational unit.
		/// </summary>
		/// <value>
		/// The is operational unit.
		/// </value>
		public bool? IsOperationalUnit { get; set; }
	}
}