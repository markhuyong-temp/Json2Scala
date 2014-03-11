package com.markhuyong

import net.liftweb.json._
import net.liftweb.json.Extraction._
import net.liftweb.json.JObject
import net.liftweb.json.JString
import org.apache.commons.io.FileUtils
import net.liftweb.common.Loggable
import code.util.FileHelper
import com.markhuyong.JsonParserCn2.Row

/**
 * Created by mark on 3/6/14.
 */
object ParserUniversityJson extends App with Loggable with FileHelper {
  val fileName = "./src/main/resources/allunivlist.json"
  val utf8 = "UTF-8"

  val json = parse(scala.io.Source.fromFile(fileName).mkString)
  logger.debug(s"fileName:json:: ${json.children.take(2).last}")

  val countries = JsonParserCn2.wo3.countries
  logger.debug(s"country:json:: $countries")

  def ctreateUniversity = json.children collect {
    case JObject(l) => {
        val JString(name) = l.find(_.name.equals("name")).headOption.map{_.value}.getOrElse(JString(""))
      logger.debug(s"name::$name")

      val (country_key, states) =countries.find(_.country.value.equals(name)).headOption.map(c => c.country.key -> c.states).getOrElse("" -> Nil)
      logger.debug(s"key::$country_key")
      val univs_c = l.find(_.name.equals("univs")).headOption.map{_.value.children map{case JObject(sc) => val JString(sc_name) = sc.last.value;sc_name}}.getOrElse(Nil)
      logger.debug(s"name::$univs_c")

      val state = l.find(_.name.equals("provs")).headOption.map{_.value.children collect {
        case JObject(s) =>{
          val JString(name) = s.find(_.name.equals("name")).headOption.map{_.value}.getOrElse(JString(""))
          val univs_s = s.find(_.name.equals("univs")).headOption.map{_.value.children map{case JObject(sc) => val JString(sc_name) = sc.last.value;sc_name}}.getOrElse(Nil)
          //val univs = if(univs_c.nonEmpty) univs_c else if(univs_s.nonEmpty) univs_s else Nil
          logger.debug(s"name::$univs_s")
          val (state_key, cities) = states.find(_.state.value.equals(name)).headOption.map(c => c.state.key -> c.cities).getOrElse("" -> Nil)
          val tuples = univs_s.map{(country_key,state_key, _)}
          logger.debug(s"country_key::$country_key ::state_key::$state_key::univs::::$tuples")
        }
      }
      }

      val tuples = univs_c.map{c =>logger.debug(s"country_key::$country_key ::state_key:: null ::univs::::$c");(country_key,"", c)}

//      val state_id = states.map{_.map(_.find(_.value.equals("name")))}
      logger.debug(s"state::$state")

      JObject(JField("country_id",JString(country_key)) :: l)
    }
  }
  ctreateUniversity
  implicit val formats = DefaultFormats
  def toJson = compact(render(decompose(ctreateUniversity)))
  val outfileName = "./src/main/scala/com/markhuyong/createdAllunivlist.json"
//  FileUtils write(getFile(outfileName), toJson, utf8)
//  logger.debug(s"mergeCountry:json:: $ctreateUniversity")
  //   val merged = country map {
  //
  //   }
}
