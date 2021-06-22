namespace Asf.RoadWorks.BusinessLogic.Models
{
	/// <summary>
	/// Citizen road work class
	/// </summary>
	/// <seealso cref="Asf.RoadWorks.BusinessLogic.Models.RoadWork" />
	public class RoadWorkMap : RoadWork
	{
		/// <summary>
		/// Gets or sets the geo feature container.
		/// </summary>
		/// <value>
		/// The geo feature container.
		/// </value>
		public string GeoFeatureContainer { get; set; }

		/// <summary>
		/// Gets or sets a value indicating whether [company is operational unit].
		/// </summary>
		/// <value>
		///   <c>true</c> if [company is operational unit]; otherwise, <c>false</c>.
		/// </value>
		public bool CompanyIsOperationalUnit { get; set; }
	}
}