package com.markhuyong

import net.liftweb.json._
import net.liftweb.common.Loggable
import net.liftweb.json.DefaultFormats
import org.apache.commons.io.FileUtils
import code.util.FileHelper
import net.liftweb.json.JField
import net.liftweb.json.JObject
import net.liftweb.json.JString
import net.liftweb.json.Extraction._

/**
 * Created by mark on 3/6/14.
 */
object MergeCountryMap extends App with Loggable with FileHelper {

  val fileName = "./src/main/resources/countryMap.json"
  val utf8 = "UTF-8"
  implicit val formats = DefaultFormats

  val json = parse(scala.io.Source.fromFile(fileName).mkString)
  logger.debug(s"fileName:json:: ${json.children}")

  val country = JsonParserCn2.wo3.countries.groupBy(_.country)
  logger.debug(s"country:json:: $country")

  def mergeCountry = json transform {
    case JObject(l) => {
      val JString(name) = l.last.value //take easy with location, lazy, eh

      val key =country.keys.find(_.value.equals(name)).get.key

      JObject(JField("key",JString(key)) :: l)
    }
  }

  def toJson = compact(render(decompose(mergeCountry)))
  val outfileName = "./src/main/scala/com/markhuyong/countryMapMerged.json"
  FileUtils write(getFile(outfileName), toJson, utf8)
  logger.debug(s"mergeCountry:json:: $mergeCountry")
//   val merged = country map {
//
//   }

}
