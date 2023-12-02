//using JSMS.Helpers;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Net;
//using System.Net.Http;
//using System.Web.Http;
//using JSMS.Models.Admin;

//namespace JSMS.Controllers.Api
//{
//    [Authorize]
//    [RoutePrefix("api/address")]
//    public class AddressesController : ApiController
//    {
//        protected readonly AddressHelper address;
//        public AddressesController()
//        {
//            address = new AddressHelper();
//        }

//        [HttpGet]
//        [Route("province")]
//        public IHttpActionResult GetProvince()
//        {
//            var datas = new List<Province>();
//            try
//            {
//                datas = address.MapProvince();
//            }
//            catch (ApplicationException ex)
//            {
//                throw new HttpResponseException(new HttpResponseMessage
//                {
//                    StatusCode = HttpStatusCode.BadRequest,
//                    ReasonPhrase = ex.Message
//                });
//            }
//            catch (Exception ex)
//            {
//                throw new HttpResponseException(new HttpResponseMessage
//                {
//                    StatusCode = HttpStatusCode.BadGateway,
//                    ReasonPhrase = ex.Message
//                });
//            }

//            return Ok(datas);
//        }

//        [HttpGet]
//        [Route("district")]
//        public IHttpActionResult GetDistrict(int provinceId)
//        {
//            var datas = new List<District>();
//            try
//            {
//                datas = address.MapDistrict(provinceId);
//            }
//            catch (ApplicationException ex)
//            {
//                throw new HttpResponseException(new HttpResponseMessage
//                {
//                    StatusCode = HttpStatusCode.BadRequest,
//                    ReasonPhrase = ex.Message
//                });
//            }
//            catch (Exception ex)
//            {
//                throw new HttpResponseException(new HttpResponseMessage
//                {
//                    StatusCode = HttpStatusCode.BadGateway,
//                    ReasonPhrase = ex.Message
//                });
//            }


//            return Ok(datas);
//        }

//        [HttpGet]
//        [Route("commune")]
//        public IHttpActionResult GetCommune(int districtId)
//        {
//            var datas = new List<Commune>();
//            try
//            {
//                datas = address.MapCommune(districtId);
//            }
//            catch (ApplicationException ex)
//            {
//                throw new HttpResponseException(new HttpResponseMessage
//                {
//                    StatusCode = HttpStatusCode.BadRequest,
//                    ReasonPhrase = ex.Message
//                });
//            }
//            catch (Exception ex)
//            {
//                throw new HttpResponseException(new HttpResponseMessage
//                {
//                    StatusCode = HttpStatusCode.BadGateway,
//                    ReasonPhrase = ex.Message
//                });
//            }


//            return Ok(datas);
//        }

//        [HttpGet]
//        [Route("village")]
//        public IHttpActionResult GetVillage(int communeId)
//        {
//            var datas = new List<Village>();
//            try
//            {
//                datas = address.MapVillage(communeId);
//            }
//            catch (ApplicationException ex)
//            {
//                throw new HttpResponseException(new HttpResponseMessage
//                {
//                    StatusCode = HttpStatusCode.BadRequest,
//                    ReasonPhrase = ex.Message
//                });
//            }
//            catch (Exception ex)
//            {
//                throw new HttpResponseException(new HttpResponseMessage
//                {
//                    StatusCode = HttpStatusCode.BadGateway,
//                    ReasonPhrase = ex.Message
//                });
//            }


//            return Ok(datas);
//        }
//    }
//}
