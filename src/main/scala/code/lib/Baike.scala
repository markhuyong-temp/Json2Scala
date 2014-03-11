package code.lib

import scala.io._
import code.util.FileHelper
import net.liftweb.common.Loggable
import org.jsoup.Jsoup
import scala.util.matching.Regex
import net.liftweb.json._
import net.liftweb.json.Extraction._
import java.net.{URLDecoder}
import scala.collection.mutable.ListBuffer
import org.apache.commons.lang3.StringEscapeUtils
import org.apache.commons.io.FileUtils

/**
 * Created by mark on 3/7/14.
 */
object Baike extends App with FileHelper with Loggable {
  val fileName = "./src/main/resources/list211.json"
  val utf8 = "UTF-8"

  val json = parse(scala.io.Source.fromFile(fileName).mkString)
  logger.debug(s"result:${json}")

  val dir = json.children map{
    case JObject(c) =>
      val JField(_, JString(p_name)) = c.head
      val JField(_, JString(sc_id)) = c.drop(1).head
      val JField(_, JString(sc_name)) = c.drop(2).head
      val JField(_, JString(url)) = c.drop(3).head
      val JField(_, JString(key_word)) = c.last
      (p_name, sc_id, sc_name, url, key_word)
  }
  implicit val formats = DefaultFormats
  val university_name = "北京大学"

  //  getPairs
  protected def getPairs: Any = {
    val pattern = new Regex( """(\{.*\})""", "result")
    val url = """http://zh.wikipedia.org/wiki/""" + university_name
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
      .timeout(14000).get().getElementById("mw-content-text").select("span.LangWithName").first().text()

    //      val p = pattern.findFirstMatchIn(re).get.group("result")
    logger.debug(s"result:${re}")
    //      p
    //    }

    //    val regex = new Regex("""choose_school(\(.*\))""", "result")
    //
    //    val school = (test \\ "result").values.toString
    //    val res: Elements = Jsoup.parse(school).select("a[href]")
    //
    //    val resa = res.iterator()
    //    while (resa.hasNext) {
    //      val text = resa.next().toString
    //      val els = regex.findFirstMatchIn(text).get.group("result")
    //      tupleStr.append(els).append("\n")
    //      logger.debug("els:" + els)
    //    }
  }
  //decodeURIComponent("%5B0%2C8%2C%7B%22fentryTableId%22%3A14901%2C%22lemmaId%22%3A8908%2C%22subLemmaId%22%3A8908%7D%2Cfalse%5D")
  //"[0,8,{"fentryTableId":14901,"lemmaId":8908,"subLemmaId":8908},false]"

//http://baike.baidu.com/guanxi/jsondata?action=getViewLemmaData&args=%5B0%2C8%2C%7B%22fentryTableId%22%3A14901%2C%22lemmaId%22%3A8908%2C%22subLemmaId%22%3A8908%7D%2Cfalse%5D
 //"fentryTableId":14901,
  val objs  = dir.flatMap (getBaidu _)
  def getBaidu(tuple: (String, String, String, String, String)) = {
//   val orgurl = """http://baike.baidu.com/view/8908.htm"""
    val orgurl = """http://baike.baidu.com""" + tuple._4
    val pageId =new Regex( """(\d+)""", "result").findFirstMatchIn(tuple._4).map(_.group("result")).getOrElse("8908")

    //    val key_word = "香港AACSB认证大学".map(c => "%s\t\\u%04x".format(c, c.toInt)).mkString
    val token = if(tuple._5.length > 3) tuple._5 else tuple._1 +""".*本科"""
    val key_word = token.map {
      c =>
        if (c.toInt < 127) c else "\\\\u%04X".format(c.toInt).toLowerCase
    }.mkString
    logger.debug("key_word:" + key_word)

    //,"fentryTableName":"\u9999\u6e2fAACSB\u8ba4\u8bc1\u5927\u5b66",
    val pattern = new Regex( """fentryTableId[":]+(\d+)[,"]+fentryTableName[":"]+""" + key_word, "result")

    val re = Jsoup.connect(orgurl)
      .ignoreContentType(true)
      .header("Accept-Language", "zh")
      .userAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36")
      .followRedirects(true)
      .timeout(14000).get().body() //.select("h3.relation-table-title")

    logger.debug(s"re:::::::${re.html()}")
    val rsId = pattern.findFirstMatchIn(re.html()).map(_.group("result")).getOrElse("0000").toString

    val url =s"http://baike.baidu.com/guanxi/jsondata?action=getViewLemmaData&args=%5B0%2C8%2C%7B%22fentryTableId%22%3A" +
      rsId + s"%2C%22lemmaId%22%3A"+ pageId +"%2C%22subLemmaId%22%3A" + pageId +s"%7D%2Cfalse%5D"
    logger.debug("url:" + url)



    //      val url = "http://en.wikipedia.org/wiki/Main_Page"
    //    val test = JsonParser.parse {
    val re2 = Jsoup.connect(url)
      .ignoreContentType(true)
      .header("Accept-Language", "zh")
      .userAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36")
      .followRedirects(true)
      .timeout(14000).get().body()//.select("h3.relation-table-title")

//    val ll =parse { re2.toString}.\\("html").toString
//    val tt = Jsoup.parse(ll)
    val test = re2.select("a").iterator()
    val list = ListBuffer((tuple._3,orgurl))
    while(test.hasNext){
      val elm =test.next()
      val cls = elm.attr("class").contains("link-inner")
      val dcj = StringEscapeUtils.unescapeJava(elm.attr("title")).contains("待创建")
      if(cls && !dcj){
        val link = elm.attr("href").replaceAll("&quot;","").replace("\\","").replace("\"","").split("#")(0)
        val title =elm.attr("title").replaceAll("\\&quot;","").replace("\\\"","")
        list.append((StringEscapeUtils.unescapeJava(title),link))
      }
    }


    val fieldList ="中文名":: "外文名":: "简称":: "学校属性"::Nil
    val getField = list.toList.map {
      m =>
        val reall = Jsoup.connect(m._2)
          .ignoreContentType(true)
          .header("Accept-Language", "zh")
          .userAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36")
          .followRedirects(true)
          .timeout(14000).get().body().select("div.baseInfoWrap").select("div.biItemInner")
        val td = reall.iterator()
        val fld = ListBuffer(("key", "value"))
        while (td.hasNext) {
          val record = td.next()
          val name = StringEscapeUtils.unescapeJava(record.select("span.biTitle").text()).trim.replaceAll(160.toChar.toString, "")
          val value = StringEscapeUtils.unescapeJava(record.select("div.biContent").text()).trim

          fld.append((name, value))
          //      fld.append(JField(name,JString(value)))
          val 1 = 1
        }
        val jj = fieldList.map {
          n => fld.toList.find(_._1.equals(n)).getOrElse((n, ""))
        }

        logger.debug("reall:::::" + reall)
        val pre = JObject(jj.map {
          c => JField(c._1, JString(c._2))
        })
        pre
      //      JObject(JField("univ_name",JString(m._1)) :: JField("univ_url",JString(m._2)) :: Nil)
    }

        val relist = list.toList.map { m=>
          JObject(JField("univ_name",JString(m._1)) :: JField("univ_url",JString(m._2)) :: Nil)
        }
    val tt = Jsoup.parse(test.toString)
    val rr = "&(lt|gt|quot);"
    val te = URLDecoder.decode(test.toString).replace("\\&quot;","").replaceAll(rr,"")
    logger.debug(s"result:${relist}")
    getField
  }
//  def toJson = objs.map {l =>  val dd = compact(render(decompose(l)));dd }.mkString
  def toJson = compact(render(decompose(objs)))
  val outfileName = "./src/main/scala/com/markhuyong/baikeUnivs.json"
  FileUtils write(getFile(outfileName), toJson, utf8)
}
