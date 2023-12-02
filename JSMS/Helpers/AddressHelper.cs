using JSMS.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using JSMS.Models.Admin;

namespace JSMS.Helpers
{
    public class AddressHelper
    {
        protected readonly ApplicationDbContext context;

        public AddressHelper()
        {
            context = new ApplicationDbContext();
        }

        public IEnumerable<Province> Provinces { get; set; }
        public IEnumerable<District> Districts { get; set; }
        public IEnumerable<Commune> Communes { get; set; }
        public IEnumerable<Village> Villages { get; set; }


        public List<Province> MapProvince()
        {
            this.context.Configuration.ProxyCreationEnabled = false;
            var response = new List<Province>();

            try
            {
                response = context.Provinces.ToList();
            }
            catch (Exception ex)
            {
                ex.ToString();
            }
            return response;
        }

        public List<District> MapDistrict(int province)
        {
            this.context.Configuration.ProxyCreationEnabled = false;
            var response = new List<District>();

            try
            {
                response = context.Districts.Where(c => c.Province.Equals(province)).ToList();
            }
            catch (Exception ex)
            {
                ex.ToString();
            }
            return response;
        }

        public List<Commune> MapCommune(int district)
        {
            this.context.Configuration.ProxyCreationEnabled = false;
            var response = new List<Commune>();

            try
            {
                response = context.Communes.Where(c => c.District.Equals(district)).ToList();
            }
            catch (Exception ex)
            {
                ex.ToString();
            }
            return response;
        }

        public List<Village> MapVillage(int communeId)
        {
            this.context.Configuration.ProxyCreationEnabled = false;
            var response = new List<Village>();

            try
            {
                response = context.Villages.SqlQuery("SELECT * FROM Villages WHERE Commune = @communeId", new SqlParameter("@communeId", communeId)).ToList();
                //response = context.Villages.Where(a => a.Commune_Id.Equals(communeId)).ToList();
            }
            catch (Exception ex)
            {
                ex.ToString();
            }
            return response;
        }
    }
}