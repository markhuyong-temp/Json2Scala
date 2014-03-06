/**
 * Created by mark on 3/4/14.
 */

import net.liftweb.common.Loggable
import net.liftweb.json.JsonParser
import org.apache.commons.io.FileUtils
import org.jsoup.Jsoup
import org.jsoup.select.Elements
import scala.util.matching.Regex
import code.util.FileHelper

/**
 * Created by mark on 3/3/14.
 */

object wiki extends App with FileHelper with Loggable {
  //http://api.pengyou.com/json.php?cb=__i_6&mod=school&act=selector&schooltype=3&country=0&province=31&g_tk=748662657

  val country_snippet =
    """
      |<select name="select" id="state" onchange="SchoolSelectFrame.change_state()" style="">
      |    <option selected="" value="0">中国</option>
      |    <option value="36">澳大利亚</option>
      |    <option value="124">加拿大</option>
      |    <option value="208">丹麦</option>
      |    <option value="372">爱尔兰</option>
      |    <option value="458">马来西亚</option>
      |    <option value="528">荷兰</option>
      |    <option value="554">新西兰</option>
      |    <option value="578">挪威</option>
      |    <option value="608">菲律宾</option>
      |    <option value="702">新加坡</option>
      |    <option value="710">南非</option>
      |    <option value="764">泰国</option>
      |    <option value="826">英国</option>
      |    <option value="840">美国</option>
      |</select>
    """.stripMargin

  val province_snippet =
    """
      |<select id="province" style="width:105px;" onchange="SchoolSelectFrame.change_province()">
      |    <option value="11">北京</option>
      |    <option value="12">天津</option>
      |    <option value="13">河北</option>
      |    <option value="14">山西</option>
      |    <option value="15">内蒙古</option>
      |    <option value="21">辽宁</option>
      |    <option value="22">吉林</option>
      |    <option value="23">黑龙江</option>
      |    <option value="31">上海</option>
      |    <option value="32">江苏</option>
      |    <option value="33">浙江</option>
      |    <option value="34">安徽</option>
      |    <option value="35">福建</option>
      |    <option value="36">江西</option>
      |    <option value="37">山东</option>
      |    <option value="41">河南</option>
      |    <option value="42">湖北</option>
      |    <option value="43">湖南</option>
      |    <option value="44">广东</option>
      |    <option value="45">广西</option>
      |    <option value="46">海南</option>
      |    <option value="50">重庆</option>
      |    <option value="51">四川</option>
      |    <option value="52">贵州</option>
      |    <option value="53">云南</option>
      |    <option value="54">西藏</option>
      |    <option value="61">陕西</option>
      |    <option value="62">甘肃</option>
      |    <option value="63">青海</option>
      |    <option value="64">宁夏</option>
      |    <option value="65">新疆</option>
      |    <option value="71">台湾</option>
      |    <option value="81">香港</option>
      |    <option value="82">澳门</option>
      |</select>
    """.stripMargin

  val outfileName = "./wiki.txt"
  val tupleStr = new StringBuffer()
  val country_parser = Jsoup.parse(country_snippet)
  logger.debug(s"country_parser:${country_parser}")

  //  val value = country_parser.select("#state > option:contains(\"澳大利亚\")")
  val value = country_parser.select("#state > option:contains(" + "澳大利亚" + ")").`val`()

  logger.debug(s"country_parser value :${value}")

  val province_parser = Jsoup.parse(province_snippet)
  logger.debug(s"province_parser:${province_parser}")

  val provinces = province_parser.select("#province >option").iterator()

  //  while(provinces.hasNext){
  //    val pro = provinces.next().`val`()
  //    getPairs(pro)
  //  }

  //  FileUtils.write(getFile(outfileName), tupleStr.toString(), "UTF-8")

  //set http proxy
  System.setProperty("http.proxyHost", "127.0.0.1");
  System.setProperty("http.proxyPort", "8087");
    val university_name = "北京大学"
//  lazy val university_name = "%E5%8C%97%E4%BA%AC%E5%A4%A7%E5%AD%A6"

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

  getBaidu
  def getBaidu = {
    val url = """http://baike.baidu.com/view/8908.htm"""
    logger.debug("url:" + url)
    //      val url = "http://en.wikipedia.org/wiki/Main_Page"
    //    val test = JsonParser.parse {
    val re = Jsoup.connect(url)
    .ignoreContentType(true)
      .header("Accept-Language", "zh")
      .userAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36")
      .followRedirects(true)
      .timeout(14000).get().html()

    logger.debug(s"result:${re}")
  }

}
