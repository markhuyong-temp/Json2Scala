package code.lib

import org.jsoup.Jsoup
import scala.util.matching.Regex
import code.util.FileHelper
import net.liftweb.common.Loggable
import net.liftweb.json._
import net.liftweb.json.Extraction._
import scala.collection.mutable.ListBuffer
import org.apache.commons.io.FileUtils

/**
 * Created by mark on 3/6/14.
 */
object Renren extends App with FileHelper with Loggable {


  val outfileName = "./renren_colleage.json"

  val fileName = "./src/main/resources/allunivlist.json"
  val utf8 = "UTF-8"
  implicit val formats = DefaultFormats

  val json = parse(scala.io.Source.fromFile(fileName).mkString)
  val co = JArray(getFaculties.flatten)
  def toJson = compact(render(decompose(co)))

  FileUtils write(getFile(outfileName), toJson, utf8)

  def getFaculties = json.children.headOption.map {
    case JObject(l) => l.find(_.name.equals("provs")).headOption.map {
      _.value.children collect {
        case JObject(s) => {
          val univs_s = s.find(_.name.equals("univs")).headOption.map{_.value.children map{
            case JObject(sc) =>
              val JInt(sc_id) = sc.head.value
              val JString(sc_name) = sc.last.value
             val p = getPairs(sc_id.toString) map {JString(_)}
//              logger.debug(s"china::::$p")
//              logger.debug(s"china::::${p}")
            JObject(JField("id",JInt(sc_id))::JField("name",JString(sc_name))::JField("college",JArray(p))::Nil)

          }

          }.getOrElse(Nil)
          univs_s
        }

      }
    }.get

  }.get

  val url = "http://www.renren.com/GetDep.do?id=1004" //id college_id
  val school_id = "1004"

  protected def getPairs(school_id: String) = {
    val pattern = new Regex( """(\{.*\})""", "result")
    val url = """http://www.renren.com/GetDep.do?id=""" + school_id
    logger.debug("url:" + url)
    //      val url = "http://en.wikipedia.org/wiki/Main_Page"
    //    val test = JsonParser.parse {
    val re = Jsoup.connect(url)
      .ignoreContentType(true)
      .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
      .header("Accept-Encoding", "gzip,deflate,sdch")
      .header("Accept-Language", "zh")
      .header("Cache-Control", "max-age=0")
      .header("Host", "zh.wikipedia.org")
      .header("Pragma:", "no-cache")
      //.header("Cookie", "centralnotice_bucket=1-4.2; uls-previous-languages=%5B%22zh%22%5D; mediaWiki.user.sessionId=ozfVvWSjftG4Z4obJaAPOdS8bPdTHrlb; centralnotice_bannercount_fr12=1")
      .userAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36")
      .referrer("http://zh.wikipedia.org/wiki/Main_Page")
      .followRedirects(true)
      .timeout(14000).get()

//    logger.debug(s"result:${re}")
    val els = re.select("#department >option")
    val resa = els.iterator()
    val list = new ListBuffer[String]
     while (resa.hasNext) {
      val text = Some(resa.next().text())
       text.filterNot(t => t.equals("院系")||t.equals("其它院系")) map(list.append(_))
    }
    list.toList
  }


}
