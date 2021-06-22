using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Asf.RoadWorks.API.Models
{
    public class Authority
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public string LogoUrl { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
    }
}
