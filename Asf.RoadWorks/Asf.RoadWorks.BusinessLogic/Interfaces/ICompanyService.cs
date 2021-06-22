using Asf.RoadWorks.BusinessLogic.Models;
using SmartTech.Infrastructure.Search;
using System;
using System.Threading.Tasks;

namespace Asf.RoadWorks.BusinessLogic.Interfaces
{
	/// <summary>
	/// Road works service interface.
	/// </summary>
	public interface ICompanyService
	{
		/// <summary>
		/// Searches the companies.
		/// </summary>
		/// <param name="searchCriteria">The search criteria.</param>
		/// <returns></returns>
		Task<FilterResult<Company>> SearchCompanies(CompanySearchCriteria searchCriteria);

		/// <summary>
		/// Get the companies.
		/// </summary>
		/// <param name="userId">The userId.</param>
		/// <returns></returns>
		Task<Company> GetUserCompany(Guid userId);

		/// <summary>
		/// Adds the company.
		/// </summary>
		/// <param name="company">The company.</param>
		/// <returns></returns>
		Task<long> AddCompany(CompanyWrite company);

		/// <summary>
		/// Updates the company.
		/// </summary>
		/// <param name="id">The identifier.</param>
		/// <param name="company">The company.</param>
		/// <returns></returns>
		Task UpdateCompany(long id, CompanyWrite company);

		/// <summary>
		/// Deletes the company.
		/// </summary>
		/// <param name="companyId">The company identifier.</param>
		/// <returns></returns>
		Task DeleteCompany(long companyId);
	}
}