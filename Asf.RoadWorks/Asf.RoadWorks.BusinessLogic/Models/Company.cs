namespace Asf.RoadWorks.BusinessLogic.Models
{
	/// <summary>
	/// Company model
	/// </summary>
	/// <seealso cref="Asf.RoadWorks.BusinessLogic.Models.CompanyBase" />
	public sealed class Company : CompanyBase
	{
		/// <summary>
		/// Gets or sets the identifier.
		/// </summary>
		/// <value>
		/// The identifier.
		/// </value>
		public long Id { get; set; }

		/// <summary>
		/// Gets or sets a value indicating whether this instance is operational unit.
		/// </summary>
		/// <value>
		///   <c>true</c> if this instance is operational unit; otherwise, <c>false</c>.
		/// </value>
		public bool IsOperationalUnit { get; set; }
	}
}