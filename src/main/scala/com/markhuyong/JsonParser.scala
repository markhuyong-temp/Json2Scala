package com.markhuyong

import org.apache.commons.io.FileUtils
import java.io.File
import net.liftweb.common.Loggable
import net.liftweb.json._

object JsonParser extends App with Loggable {
  val getCurrentDirectory = new java.io.File(".").getCanonicalPath
  logger.debug(s"CurrentDirectory:${getCurrentDirectory}")

  val fileName = "./src/main/resources/location_en.json"
  logger.debug(s"fileName: ${fileName}")
  //val lines = scala.io.Source.fromFile(fileName).mkString

  //  System.out.println(lines)

  val utf8 = "UTF-8"

  /**
   * read file from js source file
   */
  val jsonstr = FileUtils readFileToString(getFile(fileName), utf8)

  val outfileName = "./src/main/scala/com/markhuyong/Location.json"
  logger.debug(s"outfileName: ${outfileName}")


  implicit val formats = DefaultFormats

  //  case class City(name: String)
  //  case class State(name: String, citys:City *)
  //  case class Country(name: String,states: State *)
  //  case class World(countrys: Country *)

  case class City(key: String, name: String)

  case class State(key: String, name: String, citys: List[City])

  //  case class Country(n: String,states:Map[String,List[Map[String,State]]])
  //  case class World( Country)

  case class Country(key: String, name: String, states: List[State])

  case class World(n: String, countrys: List[Country])

//  val json = parse(jsonstr).asInstanceOf[JObject]
val json = parse(jsonstr)
  val values = json.values
  val res = values match {
    case coun: Map[String, _] => logger.debug(s"country_name:${coun.get("n")}"); coun.get("n")
    case _ => logger.debug(s"error country"); JNothing
  }

  json
  logger.debug("json1" + json)
  val test= json.children.map {
    v =>
      logger.debug("child=" + v.values)
      v.values

  }



  import net.liftweb.json.JsonAST._
  import net.liftweb.json.Extraction._
  import net.liftweb.json.Printer._

    val toJson = compact(render(decompose(json)))
  //val toJson = decompose(test.head.asInstanceOf[Map[String,_]])
  val head = test.head
//  val toJson = decompose(test.head)
//  logger.debug("toJson: " + toJson)
  //  val test = json.children.map {
  //    cou => cou.children map { s => s.children map { c =>
  //      logger.debug("child_city=" + c )
  //      c
  //    }

  //
  //    }
  //
  //  }

//  logger.debug(s"json: ${json}")

//  logger.debug(s"json.values: ${values}")

  //  case class Fields(country_id: String,(: Double, field3: Boolean)

//    val result = json.extract[World]
  //val result = json.extract[Map[String,Country]]

  /**
   * output scala source file
   */
//    FileUtils write(getFile(outfileName), jsonstr, utf8)
//    logger.debug(result)

  // standard using block definition
  def using[X <: {def close()}, A](resource: X)(f: X => A) = {
    try {
      f(resource)
    } finally {
      resource.close()
    }
  }

  def getFile(filename: String): File = {
    logger.debug(s"filename = ${filename}")
    val file = new File(s"${filename}")
    if (!file.exists()) file.createNewFile()
    file
  }
}