using System.Collections.Generic;

namespace Asf.RoadWorks.API.Models
{
    /// <summary>
    /// RoadWorskExcelViewModel
    /// </summary>
    public class RoadWorskExcelViewModel
    {
        /// <summary>
        /// Gets or sets the road works.
        /// </summary>
        /// <value>
        /// The road works.
        /// </value>
        public IEnumerable<RoadworkForExcel> RoadWorks { get; set; }
    }
}