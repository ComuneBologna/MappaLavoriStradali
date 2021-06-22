using SmartTech.Infrastructure.Search;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	/// <summary>
	/// 
	/// </summary>
	/// <seealso cref="SmartTech.Infrastructure.Search.FilterCriteria" />
	public class RoadwaysSearchCriteria : FilterCriteria
	{
		/// <summary>
		/// Gets or sets the identifier.
		/// </summary>
		/// <value>
		/// The identifier.
		/// </value>
		public short? Id { get; set; }

		/// <summary>
		/// Gets or sets the name.
		/// </summary>
		/// <value>
		/// The name.
		/// </value>
		public string Name { get; set; }
	}
}