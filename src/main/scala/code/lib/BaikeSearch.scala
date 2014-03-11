package code.lib

import code.util.FileHelper
import net.liftweb.common._
import net.liftweb.util.ControlHelpers
import net.liftweb.json._
import com.mongodb.BsonDSL._
import scala.util.matching.Regex
import org.jsoup.Jsoup
import org.apache.commons.lang3.StringEscapeUtils
import java.net.URLDecoder
import net.liftweb.json.Extraction._
import org.apache.commons.io.FileUtils
import scala.collection.mutable.ListBuffer
import net.liftweb.common.Full
import com.markhuyong.CorrectUnivs

/**
 * Created by mark on 3/10/14.
 */
object BaikeSearch extends App with ControlHelpers with FileHelper with Loggable {
  val fileName = "./src/main/resources/allunivlist.json"
  val utf8 = "UTF-8"

  val json = parse(scala.io.Source.fromFile(fileName).mkString)
  //logger.debug(s"result:${json}")

  val dir = json
//  logger.debug(s"dir:${dir}")
  val univlist = ctreateUniversity flatten

  def ctreateUniversity = json.children collect {
    case JObject(l) if(l.find(_.name.equals("id")).exists(_.value.equals(JString("00")))) => {
      val JString(name) = l.find(_.name.equals("name")).headOption.map{_.value}.getOrElse(JString(""))
      //logger.debug(s"name::$name")

      val country_key ="00"  //countries.find(_.country.value.equals(name)).headOption.map(c => c.country.key -> c.states).getOrElse("" -> Nil)
      //logger.debug(s"key::$country_key")

      val state = l.find(_.name.equals("provs")).headOption.map{s =>val list =s.value.children collect {
        case JObject(s) =>{
          val JString(state_name) = s.find(_.name.equals("name")).headOption.map{_.value}.getOrElse(JString(""))
          //val JString(state_key) = s.find(_.name.equals("country_id")).headOption.map{_.value}.getOrElse(JString(""))
          val univs_s = s.find(_.name.equals("univs")).headOption.map {
            _.value.children map {
              case JObject(sc) =>
                val JInt(sc_id) = sc.head.value
                val JString(sc_name) = sc.last.value
                (sc_id.toString, sc_name)
            }
          } //.getOrElse(Nil)
          //logger.debug(s"name::$univs_s")
          val tuples = univs_s.map{_ map{ case (key,value) => (country_key,state_name, key, value)}}

          val checklist = CorrectUnivs.replace
          val v_value = univs_s map {
            _ flatMap {
              case (key, value) =>
                val checkvalue = checklist.find(_._1.equals(key))
                if (checkvalue.nonEmpty && checkvalue.get._3.nonEmpty)
                  getUni(key, checkvalue.get._3.trim)
                else
                  getUni(key, value)
            }
          }
          v_value.getOrElse(Nil)
          //logger.debug(s"country_key::$country_key ::state_key::$state_name::univs::::$tuples")
        }
      }
       list.flatten
      }
      state.getOrElse(Nil)
      //JObject(JField("country_id",JString(country_key)) :: l)
    }
  }
  val 1=1
  implicit val formats = DefaultFormats
  val university_name = "北京大学"
  val timeout = 10 *  1000
  //getUni("北京大学")
  //getUni("燕京理工大学")
  def getUni(key:String, name: String) ={
    //Thread.sleep(timeout)
    //http://baike.baidu.com/search/word?word=%E5%90%88%E5%B7%A5%E5%A4%A7&pic=1&sug=1&enc=utf8&oq=%E5%90%88%E5%B7%A5%E5%A4%A7
    val url = s"http://baike.baidu.com/search/word?word=$name&pic=1&sug=1&enc=utf8&oq=$name"
//    val url = """http://baike.baidu.com/search/word?word=%E5%90%88%E5%B7%A5%E5%A4%A7&pic=1&sug=1&enc=utf8&oq=%E5%90%88%E5%B7%A5%E5%A4%A7"""
    val re = retry(3) {
            Jsoup.connect(url)
              .ignoreContentType(true)
              .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
              .header("Accept-Encoding", "gzip,deflate,sdch")
              .header("Accept-Language", "zh")
              .header("Connection", "keep-alive")
              .header("Host", "baike.baidu.com")
              .userAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36")
              .referrer("http://baike.baidu.com")
              .followRedirects(true)
              .ignoreHttpErrors(true)
              .timeout(timeout).get()
          }

//    val refurl = "http://baike.baidu.com/view/5712.htm"
    val loc = re.map(_.location().split("\\?").headOption).openOr(None)
    val refurl = loc.filter(_.contains("view"))
    //logger.debug("refurl:"+ refurl)
    if(refurl.isEmpty)logger.debug(s"nonematch = ($key, $name, ${loc.getOrElse("http://baike.baidu.com")}))")

    val fieldList ="中文名|学校名称|中文名称":: "外文名|英文名|外文名称":: "简称":: "英文简称":: "学校属性" ::"学校类型"::Nil
    val reall = refurl.map(getFields(_, fieldList)(key))

    //logger.debug(s"result:${reall}")
    reall
  }

  def getFields(refurl: String, fieldList: List[String])(sc_id: String) = {
    val reall = retry(3) {Jsoup.connect(refurl)
      .ignoreContentType(true)
      .header("Accept-Language", "zh")
      .userAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36")
      .followRedirects(true)
      .timeout(timeout).get().body().select("div.baseInfoWrap").select("div.biItemInner")
    }

    val fld = ListBuffer(("id", sc_id))
    reall.map {
      elms =>
        val td = elms.iterator()
        while (td.hasNext) {
          val record = td.next()
          val name = StringEscapeUtils.unescapeJava(record.select("span.biTitle").text()).trim.replaceAll(160.toChar.toString, "")
          val value = StringEscapeUtils.unescapeJava(record.select("div.biContent").text()).trim

          //for abbr_en
          val abbr_? = fieldList.drop(2).headOption.map(_.equals(name))
          abbr_?.collect {
            case b if (b == true) => new Regex( """(\w+)""", "result").findFirstMatchIn(value).map(_.group("result")).getOrElse("")
          }.map {
            v => fld.append(("英文简称", v))
          }

          fld.append((name, value))
          // for debug
          val 1 = 1
        }
    }
    val jjtail = fieldList.map {
      n =>
        val np = n.split("\\|")
        val res = fld.toList.find(t => np.exists(_.equals(t._1)))
        if(res.isDefined) (np.head, res.get._2) else (np.head, "")
    }
    val jj = ("id", sc_id) :: jjtail
    //logger.debug("reall:::::" + reall)
    val pre = JObject(jj.map {
      c => JField(c._1, JString(c._2))
    })
    pre
  }

  // Returning T, throwing the exception on failure
  @annotation.tailrec
  def retry[T](n: Int)(fn: => T): Box[T] = {
    tryo {
      fn
    } match {
      case Full(x) => Full(x)
      case _ if n > 1 => retry(n - 1)(fn)
      case Failure(msg, e, _) => Failure(msg, Empty, Empty)
    }
  }
  //  def toJson = objs.map {l =>  val dd = compact(render(decompose(l)));dd }.mkString
  def toJson = compact(render(decompose(univlist)))
  val outfileName = "./src/main/scala/com/markhuyong/baikeAllUnivs.json"
  FileUtils write(getFile(outfileName), toJson, utf8)
}
