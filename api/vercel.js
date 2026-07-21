// src/lib/logger.ts
import path5 from "path";
import _util from "util";
import "colors";
import _5 from "lodash";
import fs5 from "fs-extra";
import { format as dateFormat2 } from "date-fns";

// src/lib/configs/service-config.ts
import path3 from "path";
import fs3 from "fs-extra";
import yaml from "yaml";
import _3 from "lodash";

// src/lib/environment.ts
import path from "path";
import fs from "fs-extra";
import minimist from "minimist";
import _ from "lodash";
var cmdArgs = minimist(process.argv.slice(2));
var envVars = process.env;
var Environment = class {
  /** 命令行参数 */
  cmdArgs;
  /** 环境变量 */
  envVars;
  /** 环境名称 */
  env;
  /** 服务名称 */
  name;
  /** 服务地址 */
  host;
  /** 服务端口 */
  port;
  /** 包参数 */
  package;
  constructor(options = {}) {
    const { cmdArgs: cmdArgs2, envVars: envVars2, package: _package } = options;
    this.cmdArgs = cmdArgs2;
    this.envVars = envVars2;
    this.env = _.defaultTo(cmdArgs2.env || envVars2.SERVER_ENV, "dev");
    this.name = cmdArgs2.name || envVars2.SERVER_NAME || void 0;
    this.host = cmdArgs2.host || envVars2.SERVER_HOST || void 0;
    this.port = Number(cmdArgs2.port || envVars2.SERVER_PORT) ? Number(cmdArgs2.port || envVars2.SERVER_PORT) : void 0;
    this.package = _package;
  }
};
var environment_default = new Environment({
  cmdArgs,
  envVars,
  package: JSON.parse(fs.readFileSync(path.join(path.resolve(), "package.json")).toString())
});

// src/lib/util.ts
import os from "os";
import path2 from "path";
import crypto from "crypto";
import { Readable, Writable } from "stream";
import "colors";
import mime from "mime";
import fs2 from "fs-extra";
import { v1 as uuid } from "uuid";
import { format as dateFormat } from "date-fns";
import CRC32 from "crc-32";
import randomstring from "randomstring";
import _2 from "lodash";
import { CronJob } from "cron";

// src/lib/http-status-codes.ts
var http_status_codes_default = {
  CONTINUE: 100,
  //客户端应当继续发送请求。这个临时响应是用来通知客户端它的部分请求已经被服务器接收，且仍未被拒绝。客户端应当继续发送请求的剩余部分，或者如果请求已经完成，忽略这个响应。服务器必须在请求完成后向客户端发送一个最终响应
  SWITCHING_PROTOCOLS: 101,
  //服务器已经理解了客户端的请求，并将通过Upgrade 消息头通知客户端采用不同的协议来完成这个请求。在发送完这个响应最后的空行后，服务器将会切换到在Upgrade 消息头中定义的那些协议。只有在切换新的协议更有好处的时候才应该采取类似措施。例如，切换到新的HTTP 版本比旧版本更有优势，或者切换到一个实时且同步的协议以传送利用此类特性的资源
  PROCESSING: 102,
  //处理将被继续执行
  OK: 200,
  //请求已成功，请求所希望的响应头或数据体将随此响应返回
  CREATED: 201,
  //请求已经被实现，而且有一个新的资源已经依据请求的需要而建立，且其 URI 已经随Location 头信息返回。假如需要的资源无法及时建立的话，应当返回 '202 Accepted'
  ACCEPTED: 202,
  //服务器已接受请求，但尚未处理。正如它可能被拒绝一样，最终该请求可能会也可能不会被执行。在异步操作的场合下，没有比发送这个状态码更方便的做法了。返回202状态码的响应的目的是允许服务器接受其他过程的请求（例如某个每天只执行一次的基于批处理的操作），而不必让客户端一直保持与服务器的连接直到批处理操作全部完成。在接受请求处理并返回202状态码的响应应当在返回的实体中包含一些指示处理当前状态的信息，以及指向处理状态监视器或状态预测的指针，以便用户能够估计操作是否已经完成
  NON_AUTHORITATIVE_INFO: 203,
  //服务器已成功处理了请求，但返回的实体头部元信息不是在原始服务器上有效的确定集合，而是来自本地或者第三方的拷贝。当前的信息可能是原始版本的子集或者超集。例如，包含资源的元数据可能导致原始服务器知道元信息的超级。使用此状态码不是必须的，而且只有在响应不使用此状态码便会返回200 OK的情况下才是合适的
  NO_CONTENT: 204,
  //服务器成功处理了请求，但不需要返回任何实体内容，并且希望返回更新了的元信息。响应可能通过实体头部的形式，返回新的或更新后的元信息。如果存在这些头部信息，则应当与所请求的变量相呼应。如果客户端是浏览器的话，那么用户浏览器应保留发送了该请求的页面，而不产生任何文档视图上的变化，即使按照规范新的或更新后的元信息应当被应用到用户浏览器活动视图中的文档。由于204响应被禁止包含任何消息体，因此它始终以消息头后的第一个空行结尾
  RESET_CONTENT: 205,
  //服务器成功处理了请求，且没有返回任何内容。但是与204响应不同，返回此状态码的响应要求请求者重置文档视图。该响应主要是被用于接受用户输入后，立即重置表单，以便用户能够轻松地开始另一次输入。与204响应一样，该响应也被禁止包含任何消息体，且以消息头后的第一个空行结束
  PARTIAL_CONTENT: 206,
  //服务器已经成功处理了部分 GET 请求。类似于FlashGet或者迅雷这类的HTTP下载工具都是使用此类响应实现断点续传或者将一个大文档分解为多个下载段同时下载。该请求必须包含 Range 头信息来指示客户端希望得到的内容范围，并且可能包含 If-Range 来作为请求条件。响应必须包含如下的头部域：Content-Range 用以指示本次响应中返回的内容的范围；如果是Content-Type为multipart/byteranges的多段下载，则每一段multipart中都应包含Content-Range域用以指示本段的内容范围。假如响应中包含Content-Length，那么它的数值必须匹配它返回的内容范围的真实字节数。Date和ETag或Content-Location，假如同样的请求本应该返回200响应。Expires, Cache-Control，和/或 Vary，假如其值可能与之前相同变量的其他响应对应的值不同的话。假如本响应请求使用了 If-Range 强缓存验证，那么本次响应不应该包含其他实体头；假如本响应的请求使用了 If-Range 弱缓存验证，那么本次响应禁止包含其他实体头；这避免了缓存的实体内容和更新了的实体头信息之间的不一致。否则，本响应就应当包含所有本应该返回200响应中应当返回的所有实体头部域。假如 ETag 或 Latest-Modified 头部不能精确匹配的话，则客户端缓存应禁止将206响应返回的内容与之前任何缓存过的内容组合在一起。任何不支持 Range 以及 Content-Range 头的缓存都禁止缓存206响应返回的内容
  MULTIPLE_STATUS: 207,
  //代表之后的消息体将是一个XML消息，并且可能依照之前子请求数量的不同，包含一系列独立的响应代码
  MULTIPLE_CHOICES: 300,
  //被请求的资源有一系列可供选择的回馈信息，每个都有自己特定的地址和浏览器驱动的商议信息。用户或浏览器能够自行选择一个首选的地址进行重定向。除非这是一个HEAD请求，否则该响应应当包括一个资源特性及地址的列表的实体，以便用户或浏览器从中选择最合适的重定向地址。这个实体的格式由Content-Type定义的格式所决定。浏览器可能根据响应的格式以及浏览器自身能力，自动作出最合适的选择。当然，RFC 2616规范并没有规定这样的自动选择该如何进行。如果服务器本身已经有了首选的回馈选择，那么在Location中应当指明这个回馈的 URI；浏览器可能会将这个 Location 值作为自动重定向的地址。此外，除非额外指定，否则这个响应也是可缓存的
  MOVED_PERMANENTLY: 301,
  //被请求的资源已永久移动到新位置，并且将来任何对此资源的引用都应该使用本响应返回的若干个URI之一。如果可能，拥有链接编辑功能的客户端应当自动把请求的地址修改为从服务器反馈回来的地址。除非额外指定，否则这个响应也是可缓存的。新的永久性的URI应当在响应的Location域中返回。除非这是一个HEAD请求，否则响应的实体中应当包含指向新的URI的超链接及简短说明。如果这不是一个GET或者HEAD请求，因此浏览器禁止自动进行重定向，除非得到用户的确认，因为请求的条件可能因此发生变化。注意：对于某些使用 HTTP/1.0 协议的浏览器，当它们发送的POST请求得到了一个301响应的话，接下来的重定向请求将会变成GET方式
  FOUND: 302,
  //请求的资源现在临时从不同的URI响应请求。由于这样的重定向是临时的，客户端应当继续向原有地址发送以后的请求。只有在Cache-Control或Expires中进行了指定的情况下，这个响应才是可缓存的。新的临时性的URI应当在响应的 Location 域中返回。除非这是一个HEAD请求，否则响应的实体中应当包含指向新的URI的超链接及简短说明。如果这不是一个GET或者HEAD请求，那么浏览器禁止自动进行重定向，除非得到用户的确认，因为请求的条件可能因此发生变化。注意：虽然RFC 1945和RFC 2068规范不允许客户端在重定向时改变请求的方法，但是很多现存的浏览器将302响应视作为303响应，并且使用GET方式访问在Location中规定的URI，而无视原先请求的方法。状态码303和307被添加了进来，用以明确服务器期待客户端进行何种反应
  SEE_OTHER: 303,
  //对应当前请求的响应可以在另一个URI上被找到，而且客户端应当采用 GET 的方式访问那个资源。这个方法的存在主要是为了允许由脚本激活的POST请求输出重定向到一个新的资源。这个新的 URI 不是原始资源的替代引用。同时，303响应禁止被缓存。当然，第二个请求（重定向）可能被缓存。新的 URI 应当在响应的Location域中返回。除非这是一个HEAD请求，否则响应的实体中应当包含指向新的URI的超链接及简短说明。注意：许多 HTTP/1.1 版以前的浏览器不能正确理解303状态。如果需要考虑与这些浏览器之间的互动，302状态码应该可以胜任，因为大多数的浏览器处理302响应时的方式恰恰就是上述规范要求客户端处理303响应时应当做的
  NOT_MODIFIED: 304,
  //如果客户端发送了一个带条件的GET请求且该请求已被允许，而文档的内容（自上次访问以来或者根据请求的条件）并没有改变，则服务器应当返回这个状态码。304响应禁止包含消息体，因此始终以消息头后的第一个空行结尾。该响应必须包含以下的头信息：Date，除非这个服务器没有时钟。假如没有时钟的服务器也遵守这些规则，那么代理服务器以及客户端可以自行将Date字段添加到接收到的响应头中去（正如RFC 2068中规定的一样），缓存机制将会正常工作。ETag或 Content-Location，假如同样的请求本应返回200响应。Expires, Cache-Control，和/或Vary，假如其值可能与之前相同变量的其他响应对应的值不同的话。假如本响应请求使用了强缓存验证，那么本次响应不应该包含其他实体头；否则（例如，某个带条件的 GET 请求使用了弱缓存验证），本次响应禁止包含其他实体头；这避免了缓存了的实体内容和更新了的实体头信息之间的不一致。假如某个304响应指明了当前某个实体没有缓存，那么缓存系统必须忽视这个响应，并且重复发送不包含限制条件的请求。假如接收到一个要求更新某个缓存条目的304响应，那么缓存系统必须更新整个条目以反映所有在响应中被更新的字段的值
  USE_PROXY: 305,
  //被请求的资源必须通过指定的代理才能被访问。Location域中将给出指定的代理所在的URI信息，接收者需要重复发送一个单独的请求，通过这个代理才能访问相应资源。只有原始服务器才能建立305响应。注意：RFC 2068中没有明确305响应是为了重定向一个单独的请求，而且只能被原始服务器建立。忽视这些限制可能导致严重的安全后果
  UNUSED: 306,
  //在最新版的规范中，306状态码已经不再被使用
  TEMPORARY_REDIRECT: 307,
  //请求的资源现在临时从不同的URI 响应请求。由于这样的重定向是临时的，客户端应当继续向原有地址发送以后的请求。只有在Cache-Control或Expires中进行了指定的情况下，这个响应才是可缓存的。新的临时性的URI 应当在响应的Location域中返回。除非这是一个HEAD请求，否则响应的实体中应当包含指向新的URI 的超链接及简短说明。因为部分浏览器不能识别307响应，因此需要添加上述必要信息以便用户能够理解并向新的 URI 发出访问请求。如果这不是一个GET或者HEAD请求，那么浏览器禁止自动进行重定向，除非得到用户的确认，因为请求的条件可能因此发生变化
  BAD_REQUEST: 400,
  //1.语义有误，当前请求无法被服务器理解。除非进行修改，否则客户端不应该重复提交这个请求 2.请求参数有误
  UNAUTHORIZED: 401,
  //当前请求需要用户验证。该响应必须包含一个适用于被请求资源的 WWW-Authenticate 信息头用以询问用户信息。客户端可以重复提交一个包含恰当的 Authorization 头信息的请求。如果当前请求已经包含了 Authorization 证书，那么401响应代表着服务器验证已经拒绝了那些证书。如果401响应包含了与前一个响应相同的身份验证询问，且浏览器已经至少尝试了一次验证，那么浏览器应当向用户展示响应中包含的实体信息，因为这个实体信息中可能包含了相关诊断信息。参见RFC 2617
  PAYMENT_REQUIRED: 402,
  //该状态码是为了将来可能的需求而预留的
  FORBIDDEN: 403,
  //服务器已经理解请求，但是拒绝执行它。与401响应不同的是，身份验证并不能提供任何帮助，而且这个请求也不应该被重复提交。如果这不是一个HEAD请求，而且服务器希望能够讲清楚为何请求不能被执行，那么就应该在实体内描述拒绝的原因。当然服务器也可以返回一个404响应，假如它不希望让客户端获得任何信息
  NOT_FOUND: 404,
  //请求失败，请求所希望得到的资源未被在服务器上发现。没有信息能够告诉用户这个状况到底是暂时的还是永久的。假如服务器知道情况的话，应当使用410状态码来告知旧资源因为某些内部的配置机制问题，已经永久的不可用，而且没有任何可以跳转的地址。404这个状态码被广泛应用于当服务器不想揭示到底为何请求被拒绝或者没有其他适合的响应可用的情况下
  METHOD_NOT_ALLOWED: 405,
  //请求行中指定的请求方法不能被用于请求相应的资源。该响应必须返回一个Allow 头信息用以表示出当前资源能够接受的请求方法的列表。鉴于PUT，DELETE方法会对服务器上的资源进行写操作，因而绝大部分的网页服务器都不支持或者在默认配置下不允许上述请求方法，对于此类请求均会返回405错误
  NO_ACCEPTABLE: 406,
  //请求的资源的内容特性无法满足请求头中的条件，因而无法生成响应实体。除非这是一个 HEAD 请求，否则该响应就应当返回一个包含可以让用户或者浏览器从中选择最合适的实体特性以及地址列表的实体。实体的格式由Content-Type头中定义的媒体类型决定。浏览器可以根据格式及自身能力自行作出最佳选择。但是，规范中并没有定义任何作出此类自动选择的标准
  PROXY_AUTHENTICATION_REQUIRED: 407,
  //与401响应类似，只不过客户端必须在代理服务器上进行身份验证。代理服务器必须返回一个Proxy-Authenticate用以进行身份询问。客户端可以返回一个Proxy-Authorization信息头用以验证。参见RFC 2617
  REQUEST_TIMEOUT: 408,
  //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改
  CONFLICT: 409,
  //由于和被请求的资源的当前状态之间存在冲突，请求无法完成。这个代码只允许用在这样的情况下才能被使用：用户被认为能够解决冲突，并且会重新提交新的请求。该响应应当包含足够的信息以便用户发现冲突的源头。冲突通常发生于对PUT请求的处理中。例如，在采用版本检查的环境下，某次PUT提交的对特定资源的修改请求所附带的版本信息与之前的某个（第三方）请求向冲突，那么此时服务器就应该返回一个409错误，告知用户请求无法完成。此时，响应实体中很可能会包含两个冲突版本之间的差异比较，以便用户重新提交归并以后的新版本
  GONE: 410,
  //被请求的资源在服务器上已经不再可用，而且没有任何已知的转发地址。这样的状况应当被认为是永久性的。如果可能，拥有链接编辑功能的客户端应当在获得用户许可后删除所有指向这个地址的引用。如果服务器不知道或者无法确定这个状况是否是永久的，那么就应该使用404状态码。除非额外说明，否则这个响应是可缓存的。410响应的目的主要是帮助网站管理员维护网站，通知用户该资源已经不再可用，并且服务器拥有者希望所有指向这个资源的远端连接也被删除。这类事件在限时、增值服务中很普遍。同样，410响应也被用于通知客户端在当前服务器站点上，原本属于某个个人的资源已经不再可用。当然，是否需要把所有永久不可用的资源标记为'410 Gone'，以及是否需要保持此标记多长时间，完全取决于服务器拥有者
  LENGTH_REQUIRED: 411,
  //服务器拒绝在没有定义Content-Length头的情况下接受请求。在添加了表明请求消息体长度的有效Content-Length头之后，客户端可以再次提交该请求 
  PRECONDITION_FAILED: 412,
  //服务器在验证在请求的头字段中给出先决条件时，没能满足其中的一个或多个。这个状态码允许客户端在获取资源时在请求的元信息（请求头字段数据）中设置先决条件，以此避免该请求方法被应用到其希望的内容以外的资源上
  REQUEST_ENTITY_TOO_LARGE: 413,
  //服务器拒绝处理当前请求，因为该请求提交的实体数据大小超过了服务器愿意或者能够处理的范围。此种情况下，服务器可以关闭连接以免客户端继续发送此请求。如果这个状况是临时的，服务器应当返回一个 Retry-After 的响应头，以告知客户端可以在多少时间以后重新尝试
  REQUEST_URI_TOO_LONG: 414,
  //请求的URI长度超过了服务器能够解释的长度，因此服务器拒绝对该请求提供服务。这比较少见，通常的情况包括：本应使用POST方法的表单提交变成了GET方法，导致查询字符串（Query String）过长。重定向URI “黑洞”，例如每次重定向把旧的URI作为新的URI的一部分，导致在若干次重定向后URI超长。客户端正在尝试利用某些服务器中存在的安全漏洞攻击服务器。这类服务器使用固定长度的缓冲读取或操作请求的URI，当GET后的参数超过某个数值后，可能会产生缓冲区溢出，导致任意代码被执行[1]。没有此类漏洞的服务器，应当返回414状态码
  UNSUPPORTED_MEDIA_TYPE: 415,
  //对于当前请求的方法和所请求的资源，请求中提交的实体并不是服务器中所支持的格式，因此请求被拒绝
  REQUESTED_RANGE_NOT_SATISFIABLE: 416,
  //如果请求中包含了Range请求头，并且Range中指定的任何数据范围都与当前资源的可用范围不重合，同时请求中又没有定义If-Range请求头，那么服务器就应当返回416状态码。假如Range使用的是字节范围，那么这种情况就是指请求指定的所有数据范围的首字节位置都超过了当前资源的长度。服务器也应当在返回416状态码的同时，包含一个Content-Range实体头，用以指明当前资源的长度。这个响应也被禁止使用multipart/byteranges作为其 Content-Type
  EXPECTION_FAILED: 417,
  //在请求头Expect中指定的预期内容无法被服务器满足，或者这个服务器是一个代理服务器，它有明显的证据证明在当前路由的下一个节点上，Expect的内容无法被满足
  TOO_MANY_CONNECTIONS: 421,
  //从当前客户端所在的IP地址到服务器的连接数超过了服务器许可的最大范围。通常，这里的IP地址指的是从服务器上看到的客户端地址（比如用户的网关或者代理服务器地址）。在这种情况下，连接数的计算可能涉及到不止一个终端用户
  UNPROCESSABLE_ENTITY: 422,
  //请求格式正确，但是由于含有语义错误，无法响应
  FAILED_DEPENDENCY: 424,
  //由于之前的某个请求发生的错误，导致当前请求失败，例如PROPPATCH
  UNORDERED_COLLECTION: 425,
  //在WebDav Advanced Collections 草案中定义，但是未出现在《WebDAV 顺序集协议》（RFC 3658）中
  UPGRADE_REQUIRED: 426,
  //客户端应当切换到TLS/1.0
  RETRY_WITH: 449,
  //由微软扩展，代表请求应当在执行完适当的操作后进行重试
  INTERNAL_SERVER_ERROR: 500,
  //服务器遇到了一个未曾预料的状况，导致了它无法完成对请求的处理。一般来说，这个问题都会在服务器的程序码出错时出现
  NOT_IMPLEMENTED: 501,
  //服务器不支持当前请求所需要的某个功能。当服务器无法识别请求的方法，并且无法支持其对任何资源的请求
  BAD_GATEWAY: 502,
  //作为网关或者代理工作的服务器尝试执行请求时，从上游服务器接收到无效的响应
  SERVICE_UNAVAILABLE: 503,
  //由于临时的服务器维护或者过载，服务器当前无法处理请求。这个状况是临时的，并且将在一段时间以后恢复。如果能够预计延迟时间，那么响应中可以包含一个 Retry-After 头用以标明这个延迟时间。如果没有给出这个 Retry-After 信息，那么客户端应当以处理500响应的方式处理它。注意：503状态码的存在并不意味着服务器在过载的时候必须使用它。某些服务器只不过是希望拒绝客户端的连接
  GATEWAY_TIMEOUT: 504,
  //作为网关或者代理工作的服务器尝试执行请求时，未能及时从上游服务器（URI标识出的服务器，例如HTTP、FTP、LDAP）或者辅助服务器（例如DNS）收到响应。注意：某些代理服务器在DNS查询超时时会返回400或者500错误
  HTTP_VERSION_NOT_SUPPORTED: 505,
  //服务器不支持，或者拒绝支持在请求中使用的HTTP版本。这暗示着服务器不能或不愿使用与客户端相同的版本。响应中应当包含一个描述了为何版本不被支持以及服务器支持哪些协议的实体
  VARIANT_ALSO_NEGOTIATES: 506,
  //服务器存在内部配置错误：被请求的协商变元资源被配置为在透明内容协商中使用自己，因此在一个协商处理中不是一个合适的重点
  INSUFFICIENT_STORAGE: 507,
  //服务器无法存储完成请求所必须的内容。这个状况被认为是临时的
  BANDWIDTH_LIMIT_EXCEEDED: 509,
  //服务器达到带宽限制。这不是一个官方的状态码，但是仍被广泛使用
  NOT_EXTENDED: 510
  //获取资源所需要的策略并没有没满足
};

// src/lib/util.ts
var autoIdMap = /* @__PURE__ */ new Map();
var util = {
  is2DArrays(value) {
    return _2.isArray(value) && (!value[0] || _2.isArray(value[0]) && _2.isArray(value[value.length - 1]));
  },
  uuid: (separator = true) => separator ? uuid() : uuid().replace(/\-/g, ""),
  autoId: (prefix = "") => {
    let index = autoIdMap.get(prefix);
    if (index > 999999) index = 0;
    autoIdMap.set(prefix, (index || 0) + 1);
    return `${prefix}${index || 1}`;
  },
  ignoreJSONParse(value) {
    const result = _2.attempt(() => JSON.parse(value));
    if (_2.isError(result))
      return null;
    return result;
  },
  generateRandomString(options) {
    return randomstring.generate(options);
  },
  getResponseContentType(value) {
    return value.headers ? value.headers["content-type"] || value.headers["Content-Type"] : null;
  },
  generateCookie() {
    const timestamp = util.unixTimestamp();
    const items = [
      `Hm_lvt_358cae4815e85d48f7e8ab7f3680a74b=${timestamp - Math.round(Math.random() * 2592e3)}`,
      `_ga=GA1.1.${util.generateRandomString({ length: 10, charset: "numeric" })}.${timestamp - Math.round(Math.random() * 2592e3)}`,
      `_ga_YXD8W70SZP=GS1.1.${timestamp - Math.round(Math.random() * 2592e3)}.1.1.${timestamp - Math.round(Math.random() * 2592e3)}.0.0.0`,
      `Hm_lpvt_358cae4815e85d48f7e8ab7f3680a74b=${timestamp - Math.round(Math.random() * 2592e3)}`
    ];
    return items.join("; ");
  },
  mimeToExtension(value) {
    let extension = mime.getExtension(value);
    if (extension == "mpga")
      return "mp3";
    return extension;
  },
  extractURLExtension(value) {
    const extname = path2.extname(new URL(value).pathname);
    return extname.substring(1).toLowerCase();
  },
  createCronJob(cronPatterns, callback) {
    if (!_2.isFunction(callback)) throw new Error("callback must be an Function");
    return new CronJob(cronPatterns, () => callback(), null, false, "Asia/Shanghai");
  },
  getDateString(format = "yyyy-MM-dd", date = /* @__PURE__ */ new Date()) {
    return dateFormat(date, format);
  },
  getIPAddressesByIPv4() {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (let name in interfaces) {
      const networks = interfaces[name];
      const results = networks.filter((network) => network.family === "IPv4" && network.address !== "127.0.0.1" && !network.internal);
      if (results[0] && results[0].address)
        addresses.push(results[0].address);
    }
    return addresses;
  },
  getMACAddressesByIPv4() {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (let name in interfaces) {
      const networks = interfaces[name];
      const results = networks.filter((network) => network.family === "IPv4" && network.address !== "127.0.0.1" && !network.internal);
      if (results[0] && results[0].mac)
        addresses.push(results[0].mac);
    }
    return addresses;
  },
  generateSSEData(event, data, retry) {
    return `event: ${event || "message"}
data: ${(data || "").replace(/\n/g, "\\n").replace(/\s/g, "\\s")}
retry: ${retry || 3e3}

`;
  },
  buildDataBASE64(type, ext, buffer) {
    return `data:${type}/${ext.replace("jpg", "jpeg")};base64,${buffer.toString("base64")}`;
  },
  isLinux() {
    return os.platform() !== "win32";
  },
  isIPAddress(value) {
    return _2.isString(value) && (/^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/.test(value) || /\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*/.test(value));
  },
  isPort(value) {
    return _2.isNumber(value) && value > 0 && value < 65536;
  },
  isReadStream(value) {
    return value && (value instanceof Readable || "readable" in value || value.readable);
  },
  isWriteStream(value) {
    return value && (value instanceof Writable || "writable" in value || value.writable);
  },
  isHttpStatusCode(value) {
    return _2.isNumber(value) && Object.values(http_status_codes_default).includes(value);
  },
  isURL(value) {
    return !_2.isUndefined(value) && /^(http|https)/.test(value);
  },
  isSrc(value) {
    return !_2.isUndefined(value) && /^\/.+\.[0-9a-zA-Z]+(\?.+)?$/.test(value);
  },
  isBASE64(value) {
    return !_2.isUndefined(value) && /^[a-zA-Z0-9\/\+]+(=?)+$/.test(value);
  },
  isBASE64Data(value) {
    return /^data:/.test(value);
  },
  extractBASE64DataFormat(value) {
    const match = value.trim().match(/^data:(.+);base64,/);
    if (!match) return null;
    return match[1];
  },
  removeBASE64DataHeader(value) {
    return value.replace(/^data:(.+);base64,/, "");
  },
  isDataString(value) {
    return /^(base64|json):/.test(value);
  },
  isStringNumber(value) {
    return _2.isFinite(Number(value));
  },
  isUnixTimestamp(value) {
    return /^[0-9]{10}$/.test(`${value}`);
  },
  isTimestamp(value) {
    return /^[0-9]{13}$/.test(`${value}`);
  },
  isEmail(value) {
    return /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(value);
  },
  isAsyncFunction(value) {
    return Object.prototype.toString.call(value) === "[object AsyncFunction]";
  },
  async isAPNG(filePath) {
    let head;
    const readStream = fs2.createReadStream(filePath, { start: 37, end: 40 });
    const readPromise = new Promise((resolve, reject) => {
      readStream.once("end", resolve);
      readStream.once("error", reject);
    });
    readStream.once("data", (data) => head = data);
    await readPromise;
    return head.compare(Buffer.from([97, 99, 84, 76])) === 0;
  },
  unixTimestamp() {
    return parseInt(`${Date.now() / 1e3}`);
  },
  timestamp() {
    return Date.now();
  },
  urlJoin(...values) {
    let url = "";
    for (let i = 0; i < values.length; i++)
      url += `${i > 0 ? "/" : ""}${values[i].replace(/^\/*/, "").replace(/\/*$/, "")}`;
    return url;
  },
  millisecondsToHmss(milliseconds) {
    if (_2.isString(milliseconds)) return milliseconds;
    milliseconds = parseInt(milliseconds);
    const sec = Math.floor(milliseconds / 1e3);
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec - hours * 3600) / 60);
    const seconds = sec - hours * 3600 - minutes * 60;
    const ms = milliseconds % 6e4 - seconds * 1e3;
    return `${hours > 9 ? hours : "0" + hours}:${minutes > 9 ? minutes : "0" + minutes}:${seconds > 9 ? seconds : "0" + seconds}.${ms}`;
  },
  millisecondsToTimeString(milliseconds) {
    if (milliseconds < 1e3)
      return `${milliseconds}ms`;
    if (milliseconds < 6e4)
      return `${parseFloat((milliseconds / 1e3).toFixed(2))}s`;
    return `${Math.floor(milliseconds / 1e3 / 60)}m${Math.floor(milliseconds / 1e3 % 60)}s`;
  },
  rgbToHex(r, g, b) {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  },
  hexToRgb(hex) {
    const value = parseInt(hex.replace(/^#/, ""), 16);
    return [value >> 16 & 255, value >> 8 & 255, value & 255];
  },
  md5(value) {
    return crypto.createHash("md5").update(value).digest("hex");
  },
  crc32(value) {
    return _2.isBuffer(value) ? CRC32.buf(value) : CRC32.str(value);
  },
  arrayParse(value) {
    return _2.isArray(value) ? value : [value];
  },
  booleanParse(value) {
    return value === "true" || value === true ? true : false;
  },
  encodeBASE64(value) {
    return Buffer.from(value).toString("base64");
  },
  decodeBASE64(value) {
    return Buffer.from(value, "base64").toString();
  }
};
var util_default = util;

// src/lib/configs/service-config.ts
var CONFIG_PATH = path3.join(path3.resolve(), "configs/", environment_default.env, "/service.yml");
var ServiceConfig = class _ServiceConfig {
  /** 服务名称 */
  name;
  /** @type {string} 服务绑定主机地址 */
  host;
  /** @type {number} 服务绑定端口 */
  port;
  /** @type {string} 服务路由前缀 */
  urlPrefix;
  /** @type {string} 服务绑定地址（外部访问地址） */
  bindAddress;
  constructor(options) {
    const { name, host, port, urlPrefix, bindAddress } = options || {};
    this.name = _3.defaultTo(name, "kimi-free-api");
    this.host = _3.defaultTo(host, "0.0.0.0");
    this.port = _3.defaultTo(port, 5566);
    this.urlPrefix = _3.defaultTo(urlPrefix, "");
    this.bindAddress = bindAddress;
  }
  get addressHost() {
    if (this.bindAddress) return this.bindAddress;
    const ipAddresses = util_default.getIPAddressesByIPv4();
    for (let ipAddress of ipAddresses) {
      if (ipAddress === this.host)
        return ipAddress;
    }
    return ipAddresses[0] || "127.0.0.1";
  }
  get address() {
    return `${this.addressHost}:${this.port}`;
  }
  get pageDirUrl() {
    return `http://127.0.0.1:${this.port}/page`;
  }
  get publicDirUrl() {
    return `http://127.0.0.1:${this.port}/public`;
  }
  static load() {
    const external = _3.pickBy(environment_default, (v, k) => ["name", "host", "port"].includes(k) && !_3.isUndefined(v));
    if (!fs3.pathExistsSync(CONFIG_PATH)) return new _ServiceConfig(external);
    const data = yaml.parse(fs3.readFileSync(CONFIG_PATH).toString());
    return new _ServiceConfig({ ...data, ...external });
  }
};
var service_config_default = ServiceConfig.load();

// src/lib/configs/system-config.ts
import path4 from "path";
import fs4 from "fs-extra";
import yaml2 from "yaml";
import _4 from "lodash";
var CONFIG_PATH2 = path4.join(path4.resolve(), "configs/", environment_default.env, "/system.yml");
var SystemConfig = class _SystemConfig {
  /** 是否开启请求日志 */
  requestLog;
  /** 临时目录路径 */
  tmpDir;
  /** 日志目录路径 */
  logDir;
  /** 日志写入间隔（毫秒） */
  logWriteInterval;
  /** 日志文件有效期（毫秒） */
  logFileExpires;
  /** 公共目录路径 */
  publicDir;
  /** 临时文件有效期（毫秒） */
  tmpFileExpires;
  /** 请求体配置 */
  requestBody;
  /** 是否调试模式 */
  debug;
  constructor(options) {
    const { requestLog, tmpDir, logDir, logWriteInterval, logFileExpires, publicDir, tmpFileExpires, requestBody, debug } = options || {};
    this.requestLog = _4.defaultTo(requestLog, false);
    this.tmpDir = _4.defaultTo(tmpDir, "./tmp");
    this.logDir = _4.defaultTo(logDir, "./logs");
    this.logWriteInterval = _4.defaultTo(logWriteInterval, 200);
    this.logFileExpires = _4.defaultTo(logFileExpires, 262656e4);
    this.publicDir = _4.defaultTo(publicDir, "./public");
    this.tmpFileExpires = _4.defaultTo(tmpFileExpires, 864e5);
    this.requestBody = Object.assign(requestBody || {}, {
      enableTypes: ["json", "form", "text", "xml"],
      encoding: "utf-8",
      formLimit: "100mb",
      jsonLimit: "100mb",
      textLimit: "100mb",
      xmlLimit: "100mb",
      formidable: {
        maxFileSize: "100mb"
      },
      multipart: true,
      parsedMethods: ["POST", "PUT", "PATCH"]
    });
    this.debug = _4.defaultTo(debug, true);
  }
  get rootDirPath() {
    return path4.resolve();
  }
  get tmpDirPath() {
    return path4.resolve(this.tmpDir);
  }
  get logDirPath() {
    return path4.resolve(this.logDir);
  }
  get publicDirPath() {
    return path4.resolve(this.publicDir);
  }
  static load() {
    if (!fs4.pathExistsSync(CONFIG_PATH2)) return new _SystemConfig();
    const data = yaml2.parse(fs4.readFileSync(CONFIG_PATH2).toString());
    return new _SystemConfig(data);
  }
};
var system_config_default = SystemConfig.load();

// src/lib/config.ts
var Config = class {
  /** 服务配置 */
  service = service_config_default;
  /** 系统配置 */
  system = system_config_default;
};
var config_default = new Config();

// src/lib/logger.ts
var isVercelEnv = process.env.VERCEL;
var LogWriter = class {
  #buffers = [];
  constructor() {
    !isVercelEnv && fs5.ensureDirSync(config_default.system.logDirPath);
    !isVercelEnv && this.work();
  }
  push(content) {
    const buffer = Buffer.from(content);
    this.#buffers.push(buffer);
  }
  writeSync(buffer) {
    !isVercelEnv && fs5.appendFileSync(path5.join(config_default.system.logDirPath, `/${util_default.getDateString()}.log`), buffer);
  }
  async write(buffer) {
    !isVercelEnv && await fs5.appendFile(path5.join(config_default.system.logDirPath, `/${util_default.getDateString()}.log`), buffer);
  }
  flush() {
    if (!this.#buffers.length) return;
    !isVercelEnv && fs5.appendFileSync(path5.join(config_default.system.logDirPath, `/${util_default.getDateString()}.log`), Buffer.concat(this.#buffers));
  }
  work() {
    if (!this.#buffers.length) return setTimeout(this.work.bind(this), config_default.system.logWriteInterval);
    const buffer = Buffer.concat(this.#buffers);
    this.#buffers = [];
    this.write(buffer).finally(() => setTimeout(this.work.bind(this), config_default.system.logWriteInterval)).catch((err) => console.error("Log write error:", err));
  }
};
var LogText = class {
  /** @type {string} 日志级别 */
  level;
  /** @type {string} 日志文本 */
  text;
  /** @type {string} 日志来源 */
  source;
  /** @type {Date} 日志发生时间 */
  time = /* @__PURE__ */ new Date();
  constructor(level, ...params) {
    this.level = level;
    this.text = _util.format.apply(null, params);
    this.source = this.#getStackTopCodeInfo();
  }
  #getStackTopCodeInfo() {
    const unknownInfo = { name: "unknown", codeLine: 0, codeColumn: 0 };
    const stackArray = new Error().stack.split("\n");
    const text = stackArray[4];
    if (!text)
      return unknownInfo;
    const match = text.match(/at (.+) \((.+)\)/) || text.match(/at (.+)/);
    if (!match || !_5.isString(match[2] || match[1]))
      return unknownInfo;
    const temp = match[2] || match[1];
    const _match = temp.match(/([a-zA-Z0-9_\-\.]+)\:(\d+)\:(\d+)$/);
    if (!_match)
      return unknownInfo;
    const [, scriptPath, codeLine, codeColumn] = _match;
    return {
      name: scriptPath ? scriptPath.replace(/.js$/, "") : "unknown",
      path: scriptPath || null,
      codeLine: parseInt(codeLine || 0),
      codeColumn: parseInt(codeColumn || 0)
    };
  }
  toString() {
    return `[${dateFormat2(this.time, "yyyy-MM-dd HH:mm:ss.SSS")}][${this.level}][${this.source.name}<${this.source.codeLine},${this.source.codeColumn}>] ${this.text}`;
  }
};
var Logger = class _Logger {
  /** @type {Object} 系统配置 */
  config = {};
  /** @type {Object} 日志级别映射 */
  static Level = {
    Success: "success",
    Info: "info",
    Log: "log",
    Debug: "debug",
    Warning: "warning",
    Error: "error",
    Fatal: "fatal"
  };
  /** @type {Object} 日志级别文本颜色樱色 */
  static LevelColor = {
    [_Logger.Level.Success]: "green",
    [_Logger.Level.Info]: "brightCyan",
    [_Logger.Level.Debug]: "white",
    [_Logger.Level.Warning]: "brightYellow",
    [_Logger.Level.Error]: "brightRed",
    [_Logger.Level.Fatal]: "red"
  };
  #writer;
  constructor() {
    this.#writer = new LogWriter();
  }
  header() {
    this.#writer.writeSync(Buffer.from(`

===================== LOG START ${dateFormat2(/* @__PURE__ */ new Date(), "yyyy-MM-dd HH:mm:ss.SSS")} =====================

`));
  }
  footer() {
    this.#writer.flush();
    this.#writer.writeSync(Buffer.from(`

===================== LOG END ${dateFormat2(/* @__PURE__ */ new Date(), "yyyy-MM-dd HH:mm:ss.SSS")} =====================

`));
  }
  success(...params) {
    const content = new LogText(_Logger.Level.Success, ...params).toString();
    console.info(content[_Logger.LevelColor[_Logger.Level.Success]]);
    this.#writer.push(content + "\n");
  }
  info(...params) {
    const content = new LogText(_Logger.Level.Info, ...params).toString();
    console.info(content[_Logger.LevelColor[_Logger.Level.Info]]);
    this.#writer.push(content + "\n");
  }
  log(...params) {
    const content = new LogText(_Logger.Level.Log, ...params).toString();
    console.log(content[_Logger.LevelColor[_Logger.Level.Log]]);
    this.#writer.push(content + "\n");
  }
  debug(...params) {
    if (!config_default.system.debug) return;
    const content = new LogText(_Logger.Level.Debug, ...params).toString();
    console.debug(content[_Logger.LevelColor[_Logger.Level.Debug]]);
    this.#writer.push(content + "\n");
  }
  warn(...params) {
    const content = new LogText(_Logger.Level.Warning, ...params).toString();
    console.warn(content[_Logger.LevelColor[_Logger.Level.Warning]]);
    this.#writer.push(content + "\n");
  }
  error(...params) {
    const content = new LogText(_Logger.Level.Error, ...params).toString();
    console.error(content[_Logger.LevelColor[_Logger.Level.Error]]);
    this.#writer.push(content);
  }
  fatal(...params) {
    const content = new LogText(_Logger.Level.Fatal, ...params).toString();
    console.error(content[_Logger.LevelColor[_Logger.Level.Fatal]]);
    this.#writer.push(content);
  }
  destory() {
    this.#writer.destory();
  }
};
var logger_default = new Logger();

// src/lib/initialize.ts
process.setMaxListeners(Infinity);
process.on("uncaughtException", (err, origin) => {
  logger_default.error(`An unhandled error occurred: ${origin}`, err);
});
process.on("unhandledRejection", (_17, promise) => {
  promise.catch((err) => logger_default.error("An unhandled rejection occurred:", err));
});
process.on("warning", (warning) => logger_default.warn("System warning: ", warning));
process.on("exit", () => {
  logger_default.info("Service exit");
  logger_default.footer();
});
process.on("SIGTERM", () => {
  logger_default.warn("received kill signal");
  process.exit(2);
});
process.on("SIGINT", () => {
  process.exit(0);
});

// src/lib/server.ts
import Koa from "koa";
import KoaRouter from "koa-router";
import koaRange from "koa-range";
import koaCors from "koa2-cors";
import koaBody from "koa-body";
import _11 from "lodash";

// src/lib/request/Request.ts
import _7 from "lodash";

// src/lib/exceptions/Exception.ts
import assert from "assert";
import _6 from "lodash";
var Exception = class extends Error {
  /** 错误码 */
  errcode;
  /** 错误消息 */
  errmsg;
  /** 数据 */
  data;
  /** HTTP状态码 */
  httpStatusCode;
  /**
   * 构造异常
   * 
   * @param exception 异常
   * @param _errmsg 异常消息
   */
  constructor(exception, _errmsg) {
    assert(_6.isArray(exception), "Exception must be Array");
    const [errcode, errmsg] = exception;
    assert(_6.isFinite(errcode), "Exception errcode invalid");
    assert(_6.isString(errmsg), "Exception errmsg invalid");
    super(_errmsg || errmsg);
    this.errcode = errcode;
    this.errmsg = _errmsg || errmsg;
  }
  compare(exception) {
    const [errcode] = exception;
    return this.errcode == errcode;
  }
  setHTTPStatusCode(value) {
    this.httpStatusCode = value;
    return this;
  }
  setData(value) {
    this.data = _6.defaultTo(value, null);
    return this;
  }
};

// src/lib/exceptions/APIException.ts
var APIException = class extends Exception {
  /**
   * 构造异常
   * 
   * @param {[number, string]} exception 异常
   */
  constructor(exception, errmsg) {
    super(exception, errmsg);
  }
};

// src/api/consts/exceptions.ts
var exceptions_default = {
  API_TEST: [-9999, "API\u5F02\u5E38\u9519\u8BEF"],
  API_REQUEST_PARAMS_INVALID: [-2e3, "\u8BF7\u6C42\u53C2\u6570\u975E\u6CD5"],
  API_REQUEST_FAILED: [-2001, "\u8BF7\u6C42\u5931\u8D25"],
  API_TOKEN_EXPIRES: [-2002, "Token\u5DF2\u5931\u6548"],
  API_FILE_URL_INVALID: [-2003, "\u8FDC\u7A0B\u6587\u4EF6URL\u975E\u6CD5"],
  API_FILE_EXECEEDS_SIZE: [-2004, "\u8FDC\u7A0B\u6587\u4EF6\u8D85\u51FA\u5927\u5C0F"],
  API_CHAT_STREAM_PUSHING: [-2005, "\u5DF2\u6709\u5BF9\u8BDD\u6D41\u6B63\u5728\u8F93\u51FA"]
};

// src/lib/request/Request.ts
var Request = class {
  /** 请求方法 */
  method;
  /** 请求URL */
  url;
  /** 请求路径 */
  path;
  /** 请求载荷类型 */
  type;
  /** 请求headers */
  headers;
  /** 请求原始查询字符串 */
  search;
  /** 请求查询参数 */
  query;
  /** 请求URL参数 */
  params;
  /** 请求载荷 */
  body;
  /** 上传的文件 */
  files;
  /** 客户端IP地址 */
  remoteIP;
  /** 请求接受时间戳（毫秒） */
  time;
  constructor(ctx, options = {}) {
    const { time } = options;
    this.method = ctx.request.method;
    this.url = ctx.request.url;
    this.path = ctx.request.path;
    this.type = ctx.request.type;
    this.headers = ctx.request.headers || {};
    this.search = ctx.request.search;
    this.query = ctx.query || {};
    this.params = ctx.params || {};
    this.body = ctx.request.body || {};
    this.files = ctx.request.files || {};
    this.remoteIP = this.headers["X-Real-IP"] || this.headers["x-real-ip"] || this.headers["X-Forwarded-For"] || this.headers["x-forwarded-for"] || ctx.ip || null;
    this.time = Number(_7.defaultTo(time, util_default.timestamp()));
  }
  validate(key, fn) {
    try {
      const value = _7.get(this, key);
      if (fn) {
        if (fn(value) === false)
          throw `[Mismatch] -> ${fn}`;
      } else if (_7.isUndefined(value))
        throw "[Undefined]";
    } catch (err) {
      logger_default.warn(`Params ${key} invalid:`, err);
      throw new APIException(exceptions_default.API_REQUEST_PARAMS_INVALID, `Params ${key} invalid`);
    }
    return this;
  }
};

// src/lib/response/Response.ts
import mime2 from "mime";
import _9 from "lodash";

// src/lib/response/Body.ts
import _8 from "lodash";
var Body = class _Body {
  /** 状态码 */
  code;
  /** 状态消息 */
  message;
  /** 载荷 */
  data;
  /** HTTP状态码 */
  statusCode;
  constructor(options = {}) {
    const { code, message, data, statusCode } = options;
    this.code = Number(_8.defaultTo(code, 0));
    this.message = _8.defaultTo(message, "OK");
    this.data = _8.defaultTo(data, null);
    this.statusCode = Number(_8.defaultTo(statusCode, 200));
  }
  toObject() {
    return {
      code: this.code,
      message: this.message,
      data: this.data
    };
  }
  static isInstance(value) {
    return value instanceof _Body;
  }
};

// src/lib/response/Response.ts
var Response = class _Response {
  /** 响应HTTP状态码 */
  statusCode;
  /** 响应内容类型 */
  type;
  /** 响应headers */
  headers;
  /** 重定向目标 */
  redirect;
  /** 响应载荷 */
  body;
  /** 响应载荷大小 */
  size;
  /** 响应时间戳 */
  time;
  constructor(body, options = {}) {
    const { statusCode, type, headers, redirect, size, time } = options;
    this.statusCode = Number(_9.defaultTo(statusCode, Body.isInstance(body) ? body.statusCode : void 0));
    this.type = type;
    this.headers = headers;
    this.redirect = redirect;
    this.size = size;
    this.time = Number(_9.defaultTo(time, util_default.timestamp()));
    this.body = body;
  }
  injectTo(ctx) {
    this.redirect && ctx.redirect(this.redirect);
    this.statusCode && (ctx.status = this.statusCode);
    this.type && (ctx.type = mime2.getType(this.type) || this.type);
    const headers = this.headers || {};
    if (this.size && !headers["Content-Length"] && !headers["content-length"])
      headers["Content-Length"] = this.size;
    ctx.set(headers);
    if (Body.isInstance(this.body))
      ctx.body = this.body.toObject();
    else
      ctx.body = this.body;
  }
  static isInstance(value) {
    return value instanceof _Response;
  }
};

// src/lib/response/FailureBody.ts
import _10 from "lodash";

// src/lib/consts/exceptions.ts
var exceptions_default2 = {
  SYSTEM_ERROR: [-1e3, "\u7CFB\u7EDF\u5F02\u5E38"],
  SYSTEM_REQUEST_VALIDATION_ERROR: [-1001, "\u8BF7\u6C42\u53C2\u6570\u6821\u9A8C\u9519\u8BEF"],
  SYSTEM_NOT_ROUTE_MATCHING: [-1002, "\u65E0\u5339\u914D\u7684\u8DEF\u7531"]
};

// src/lib/response/FailureBody.ts
var FailureBody = class _FailureBody extends Body {
  constructor(error, _data) {
    let errcode, errmsg, data = _data, httpStatusCode = http_status_codes_default.OK;
    ;
    if (_10.isString(error))
      error = new Exception(exceptions_default2.SYSTEM_ERROR, error);
    else if (error instanceof APIException || error instanceof Exception)
      ({ errcode, errmsg, data, httpStatusCode } = error);
    else if (_10.isError(error))
      ({ errcode, errmsg, data, httpStatusCode } = new Exception(exceptions_default2.SYSTEM_ERROR, error.message));
    super({
      code: errcode || -1,
      message: errmsg || "Internal error",
      data,
      statusCode: httpStatusCode
    });
  }
  static isInstance(value) {
    return value instanceof _FailureBody;
  }
};

// src/lib/server.ts
var Server = class {
  app;
  router;
  constructor() {
    this.app = new Koa();
    this.app.use(koaCors());
    this.app.use(koaRange);
    this.router = new KoaRouter({ prefix: config_default.service.urlPrefix });
    this.app.use(async (ctx, next) => {
      if (ctx.request.type === "application/xml" || ctx.request.type === "application/ssml+xml")
        ctx.req.headers["content-type"] = "text/xml";
      try {
        await next();
      } catch (err) {
        logger_default.error(err);
        const failureBody = new FailureBody(err);
        new Response(failureBody).injectTo(ctx);
      }
    });
    this.app.use(koaBody(_11.clone(config_default.system.requestBody)));
    this.app.on("error", (err) => {
      if (["ECONNRESET", "ECONNABORTED", "EPIPE", "ECANCELED"].includes(err.code)) return;
      logger_default.error(err);
    });
    logger_default.success("Server initialized");
  }
  /**
   * 附加路由
   * 
   * @param routes 路由列表
   */
  attachRoutes(routes) {
    routes.forEach((route) => {
      const prefix = route.prefix || "";
      for (let method in route) {
        if (method === "prefix") continue;
        if (!_11.isObject(route[method])) {
          logger_default.warn(`Router ${prefix} ${method} invalid`);
          continue;
        }
        for (let uri in route[method]) {
          this.router[method](`${prefix}${uri}`, async (ctx) => {
            const { request, response } = await this.#requestProcessing(ctx, route[method][uri]);
            if (response != null && config_default.system.requestLog)
              logger_default.info(`<- ${request.method} ${request.url} ${response.time - request.time}ms`);
          });
        }
      }
      logger_default.info(`Route ${config_default.service.urlPrefix || ""}${prefix} attached`);
    });
    this.app.use(this.router.routes());
    this.app.use((ctx) => {
      const request = new Request(ctx);
      logger_default.debug(`-> ${ctx.request.method} ${ctx.request.url} request is not supported - ${request.remoteIP || "unknown"}`);
      const message = `[\u8BF7\u6C42\u6709\u8BEF]: \u6B63\u786E\u8BF7\u6C42\u4E3A POST -> /v1/chat/completions\uFF0C\u5F53\u524D\u8BF7\u6C42\u4E3A ${ctx.request.method} -> ${ctx.request.url} \u8BF7\u7EA0\u6B63`;
      logger_default.warn(message);
      const failureBody = new FailureBody(new Error(message));
      const response = new Response(failureBody);
      response.injectTo(ctx);
      if (config_default.system.requestLog)
        logger_default.info(`<- ${request.method} ${request.url} ${response.time - request.time}ms`);
    });
  }
  /**
   * 请求处理
   * 
   * @param ctx 上下文
   * @param routeFn 路由方法
   */
  #requestProcessing(ctx, routeFn) {
    return new Promise((resolve) => {
      const request = new Request(ctx);
      try {
        if (config_default.system.requestLog)
          logger_default.info(`-> ${request.method} ${request.url}`);
        routeFn(request).then((response) => {
          try {
            if (!Response.isInstance(response)) {
              const _response = new Response(response);
              _response.injectTo(ctx);
              return resolve({ request, response: _response });
            }
            response.injectTo(ctx);
            resolve({ request, response });
          } catch (err) {
            logger_default.error(err);
            const failureBody = new FailureBody(err);
            const response2 = new Response(failureBody);
            response2.injectTo(ctx);
            resolve({ request, response: response2 });
          }
        }).catch((err) => {
          try {
            logger_default.error(err);
            const failureBody = new FailureBody(err);
            const response = new Response(failureBody);
            response.injectTo(ctx);
            resolve({ request, response });
          } catch (err2) {
            logger_default.error(err2);
            const failureBody = new FailureBody(err2);
            const response = new Response(failureBody);
            response.injectTo(ctx);
            resolve({ request, response });
          }
        });
      } catch (err) {
        logger_default.error(err);
        const failureBody = new FailureBody(err);
        const response = new Response(failureBody);
        response.injectTo(ctx);
        resolve({ request, response });
      }
    });
  }
  /**
   * 监听端口
   */
  async listen() {
    const host = config_default.service.host;
    const port = config_default.service.port;
    await Promise.all([
      new Promise((resolve, reject) => {
        if (host === "0.0.0.0" || host === "localhost" || host === "127.0.0.1")
          return resolve(null);
        this.app.listen(port, "localhost", (err) => {
          if (err) return reject(err);
          resolve(null);
        });
      }),
      new Promise((resolve, reject) => {
        this.app.listen(port, host, (err) => {
          if (err) return reject(err);
          resolve(null);
        });
      })
    ]);
    logger_default.success(`Server listening on port ${port} (${host})`);
  }
};
var server_default = new Server();

// src/api/routes/index.ts
import fs6 from "fs-extra";

// src/api/routes/chat.ts
import _14 from "lodash";

// src/api/controllers/chat.ts
import { PassThrough } from "stream";
import path6 from "path";
import _12 from "lodash";
import mime3 from "mime";
import axios from "axios";
import { createParser } from "eventsource-parser";
var MODEL_NAME = "kimi";
function parseModelConfig(model, defaultUseSearch = true) {
  const modelLower = model.toLowerCase();
  if (/^[0-9a-z]{20}$/.test(model)) {
    return {
      kimiplus_id: model,
      use_search: defaultUseSearch,
      is_pro_search: false,
      use_research: false,
      silent_search: false
    };
  }
  const isK1 = /k1(\.5)?/.test(modelLower);
  const isResearch = modelLower.includes("research");
  const isSilent = modelLower.includes("silent");
  const hasSearchFlag = modelLower.includes("search");
  return {
    kimiplus_id: "kimi",
    use_search: hasSearchFlag ? true : defaultUseSearch,
    is_pro_search: isResearch,
    use_research: isK1,
    silent_search: isSilent
  };
}
var ACCESS_TOKEN_EXPIRES = 300;
var MAX_RETRY_COUNT = 3;
var RETRY_DELAY = 5e3;
var FAKE_HEADERS = {
  "Accept": "*/*",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "zh-CN,zh;q=0.9",
  "Origin": "https://kimi.moonshot.cn",
  "Cookie": util_default.generateCookie(),
  "R-Timezone": "Asia/Shanghai",
  "Sec-Ch-Ua": '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Windows"',
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
};
var FILE_MAX_SIZE = 100 * 1024 * 1024;
var accessTokenMap = /* @__PURE__ */ new Map();
var accessTokenRequestQueueMap = {};
async function requestToken(refreshToken) {
  if (accessTokenRequestQueueMap[refreshToken])
    return new Promise((resolve) => accessTokenRequestQueueMap[refreshToken].push(resolve));
  accessTokenRequestQueueMap[refreshToken] = [];
  logger_default.info(`Refresh token: ${refreshToken}`);
  const result = await (async () => {
    try {
      const { id: directUserId } = await getUserInfo(refreshToken, refreshToken);
      if (directUserId)
        return {
          userId: directUserId,
          accessToken: refreshToken,
          refreshToken,
          refreshTime: util_default.unixTimestamp() + ACCESS_TOKEN_EXPIRES
        };
    } catch (e) {
    }
    const result2 = await axios.get("https://kimi.moonshot.cn/api/auth/token/refresh", {
      headers: {
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "zh-CN,zh;q=0.9",
        Authorization: `Bearer ${refreshToken}`,
        "Cache-Control": "no-cache",
        "Cookie": util_default.generateCookie(),
        Pragma: "no-cache",
        Referer: "https://kimi.moonshot.cn/",
        "Sec-Ch-Ua": '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
      },
      timeout: 15e3,
      validateStatus: () => true
    });
    const {
      access_token,
      refresh_token
    } = checkResult(result2, refreshToken);
    const { id: userId } = await getUserInfo(access_token, refreshToken);
    return {
      userId,
      accessToken: access_token,
      refreshToken: refresh_token,
      refreshTime: util_default.unixTimestamp() + ACCESS_TOKEN_EXPIRES
    };
  })().then((result2) => {
    if (accessTokenRequestQueueMap[refreshToken]) {
      accessTokenRequestQueueMap[refreshToken].forEach((resolve) => resolve(result2));
      delete accessTokenRequestQueueMap[refreshToken];
    }
    logger_default.success(`Refresh successful`);
    return result2;
  }).catch((err) => {
    if (accessTokenRequestQueueMap[refreshToken]) {
      accessTokenRequestQueueMap[refreshToken].forEach((resolve) => resolve(err));
      delete accessTokenRequestQueueMap[refreshToken];
    }
    return err;
  });
  if (_12.isError(result))
    throw result;
  return result;
}
async function acquireToken(refreshToken) {
  let result = accessTokenMap.get(refreshToken);
  if (!result) {
    result = await requestToken(refreshToken);
    accessTokenMap.set(refreshToken, result);
  }
  if (util_default.unixTimestamp() > result.refreshTime) {
    result = await requestToken(refreshToken);
    accessTokenMap.set(refreshToken, result);
  }
  return result;
}
async function getUserInfo(accessToken, refreshToken) {
  const result = await axios.get("https://kimi.moonshot.cn/api/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Referer: "https://kimi.moonshot.cn/",
      "X-Msh-Platform": "web",
      "X-Traffic-Id": `7${util_default.generateRandomString({ length: 18, charset: "numeric" })}`,
      ...FAKE_HEADERS
    },
    timeout: 15e3,
    validateStatus: () => true
  });
  return checkResult(result, refreshToken);
}
async function createConversation(modelConfig, name, refreshToken) {
  const {
    accessToken,
    userId
  } = await acquireToken(refreshToken);
  const result = await axios.post("https://kimi.moonshot.cn/api/chat", {
    born_from: "",
    is_example: false,
    kimiplus_id: modelConfig.kimiplus_id,
    name
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Referer: "https://kimi.moonshot.cn/",
      "X-Msh-Platform": "web",
      "X-Traffic-Id": userId,
      ...FAKE_HEADERS
    },
    timeout: 15e3,
    validateStatus: () => true
  });
  const {
    id: convId
  } = checkResult(result, refreshToken);
  return convId;
}
async function removeConversation(convId, refreshToken) {
  const {
    accessToken,
    userId
  } = await acquireToken(refreshToken);
  const result = await axios.delete(`https://kimi.moonshot.cn/api/chat/${convId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Referer: `https://kimi.moonshot.cn/chat/${convId}`,
      "X-Msh-Platform": "web",
      "X-Traffic-Id": userId,
      ...FAKE_HEADERS
    },
    timeout: 15e3,
    validateStatus: () => true
  });
  checkResult(result, refreshToken);
}
async function promptSnippetSubmit(query, refreshToken) {
  const {
    accessToken,
    userId
  } = await acquireToken(refreshToken);
  const result = await axios.post("https://kimi.moonshot.cn/api/prompt-snippet/instance", {
    "offset": 0,
    "size": 10,
    "query": query.replace("user:", "").replace("assistant:", "")
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Referer: "https://kimi.moonshot.cn/",
      "X-Msh-Platform": "web",
      "X-Traffic-Id": userId,
      ...FAKE_HEADERS
    },
    timeout: 15e3,
    validateStatus: () => true
  });
  checkResult(result, refreshToken);
}
async function createCompletion(model = MODEL_NAME, messages, refreshToken, useSearch = true, refConvId, retryCount = 0) {
  return (async () => {
    logger_default.info(messages);
    const modelConfig = parseModelConfig(model, useSearch);
    const refFileUrls = extractRefFileUrls(messages);
    const refs = refFileUrls.length ? await Promise.all(refFileUrls.map((fileUrl) => uploadFile(fileUrl, refreshToken))) : [];
    fakeRequest(refreshToken).catch((err) => logger_default.error(err));
    const convId = /[0-9a-zA-Z]{20}/.test(refConvId) ? refConvId : await createConversation(modelConfig, "\u672A\u547D\u540D\u4F1A\u8BDD", refreshToken);
    const {
      accessToken,
      userId
    } = await acquireToken(refreshToken);
    const sendMessages = messagesPrepare(messages, !!refConvId);
    const result = await axios.post(`https://kimi.moonshot.cn/api/chat/${convId}/completion/stream`, {
      kimiplus_id: modelConfig.kimiplus_id,
      messages: sendMessages,
      refs,
      is_pro_search: modelConfig.is_pro_search,
      use_search: modelConfig.use_search,
      use_research: modelConfig.use_research
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Referer: `https://kimi.moonshot.cn/chat/${convId}`,
        "Priority": "u=1, i",
        "X-Msh-Platform": "web",
        "X-Traffic-Id": userId,
        ...FAKE_HEADERS
      },
      // 120秒超时
      timeout: 12e4,
      validateStatus: () => true,
      responseType: "stream"
    });
    const streamStartTime = util_default.timestamp();
    const answer = await receiveStream(model, convId, result.data, modelConfig.silent_search);
    logger_default.success(`Stream has completed transfer ${util_default.timestamp() - streamStartTime}ms`);
    !refConvId && removeConversation(convId, refreshToken).catch((err) => console.error(err));
    promptSnippetSubmit(sendMessages[0].content, refreshToken).catch((err) => console.error(err));
    return answer;
  })().catch((err) => {
    if (retryCount < MAX_RETRY_COUNT) {
      logger_default.error(`Stream response error: ${err.message}`);
      logger_default.warn(`Try again after ${RETRY_DELAY / 1e3}s...`);
      return (async () => {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return createCompletion(model, messages, refreshToken, useSearch, refConvId, retryCount + 1);
      })();
    }
    throw err;
  });
}
async function createCompletionStream(model = MODEL_NAME, messages, refreshToken, useSearch = true, refConvId, retryCount = 0) {
  return (async () => {
    logger_default.info(messages);
    const modelConfig = parseModelConfig(model, useSearch);
    const refFileUrls = extractRefFileUrls(messages);
    const refs = refFileUrls.length ? await Promise.all(refFileUrls.map((fileUrl) => uploadFile(fileUrl, refreshToken))) : [];
    fakeRequest(refreshToken).catch((err) => logger_default.error(err));
    const convId = /[0-9a-zA-Z]{20}/.test(refConvId) ? refConvId : await createConversation(modelConfig, "\u672A\u547D\u540D\u4F1A\u8BDD", refreshToken);
    const {
      accessToken,
      userId
    } = await acquireToken(refreshToken);
    const sendMessages = messagesPrepare(messages, !!refConvId);
    const result = await axios.post(`https://kimi.moonshot.cn/api/chat/${convId}/completion/stream`, {
      kimiplus_id: modelConfig.kimiplus_id,
      messages: sendMessages,
      refs,
      is_pro_search: modelConfig.is_pro_search,
      use_search: modelConfig.use_search,
      use_research: modelConfig.use_research
    }, {
      // 120秒超时
      timeout: 12e4,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Referer: `https://kimi.moonshot.cn/chat/${convId}`,
        "Priority": "u=1, i",
        "X-Msh-Platform": "web",
        "X-Traffic-Id": userId,
        ...FAKE_HEADERS
      },
      validateStatus: () => true,
      responseType: "stream"
    });
    const streamStartTime = util_default.timestamp();
    return createTransStream(model, convId, result.data, modelConfig.silent_search, () => {
      logger_default.success(`Stream has completed transfer ${util_default.timestamp() - streamStartTime}ms`);
      !refConvId && removeConversation(convId, refreshToken).catch((err) => console.error(err));
      promptSnippetSubmit(sendMessages[0].content, refreshToken).catch((err) => console.error(err));
    });
  })().catch((err) => {
    if (retryCount < MAX_RETRY_COUNT) {
      logger_default.error(`Stream response error: ${err.message}`);
      logger_default.warn(`Try again after ${RETRY_DELAY / 1e3}s...`);
      return (async () => {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return createCompletionStream(model, messages, refreshToken, useSearch, refConvId, retryCount + 1);
      })();
    }
    throw err;
  });
}
async function fakeRequest(refreshToken) {
  const {
    accessToken,
    userId
  } = await acquireToken(refreshToken);
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Referer: `https://kimi.moonshot.cn/`,
      "X-Msh-Platform": "web",
      "X-Traffic-Id": userId,
      ...FAKE_HEADERS
    }
  };
  await [
    () => axios.get("https://kimi.moonshot.cn/api/user", options),
    () => axios.get("https://kimi.moonshot.cn/api/chat_1m/user/status", options),
    () => axios.post("https://kimi.moonshot.cn/api/chat/list", {
      offset: 0,
      size: 50
    }, options),
    () => axios.post("https://kimi.moonshot.cn/api/show_case/list", {
      offset: 0,
      size: 4,
      enable_cache: true,
      order: "asc"
    }, options)
  ][Math.floor(Math.random() * 4)]();
}
function extractRefFileUrls(messages) {
  const urls = [];
  if (!messages.length) {
    return urls;
  }
  const lastMessage = messages[messages.length - 1];
  if (_12.isArray(lastMessage.content)) {
    lastMessage.content.forEach((v) => {
      if (!_12.isObject(v) || !["file", "image_url"].includes(v["type"]))
        return;
      if (v["type"] == "file" && _12.isObject(v["file_url"]) && _12.isString(v["file_url"]["url"]))
        urls.push(v["file_url"]["url"]);
      else if (v["type"] == "image_url" && _12.isObject(v["image_url"]) && _12.isString(v["image_url"]["url"]))
        urls.push(v["image_url"]["url"]);
    });
  }
  logger_default.info("\u672C\u6B21\u8BF7\u6C42\u4E0A\u4F20\uFF1A" + urls.length + "\u4E2A\u6587\u4EF6");
  return urls;
}
function messagesPrepare(messages, isRefConv = false) {
  let content;
  if (isRefConv || messages.length < 2) {
    content = messages.reduce((content2, message) => {
      if (_12.isArray(message.content)) {
        return message.content.reduce((_content, v) => {
          if (!_12.isObject(v) || v["type"] != "text") return _content;
          return _content + `${v["text"] || ""}
`;
        }, content2);
      }
      return content2 += `${message.role == "user" ? wrapUrlsToTags(message.content) : message.content}
`;
    }, "");
    logger_default.info("\n\u900F\u4F20\u5185\u5BB9\uFF1A\n" + content);
  } else {
    let latestMessage = messages[messages.length - 1];
    let hasFileOrImage = Array.isArray(latestMessage.content) && latestMessage.content.some((v) => typeof v === "object" && ["file", "image_url"].includes(v["type"]));
    if (hasFileOrImage) {
      let newFileMessage = {
        "content": "\u5173\u6CE8\u7528\u6237\u6700\u65B0\u53D1\u9001\u6587\u4EF6\u548C\u6D88\u606F",
        "role": "system"
      };
      messages.splice(messages.length - 1, 0, newFileMessage);
      logger_default.info("\u6CE8\u5165\u63D0\u5347\u5C3E\u90E8\u6587\u4EF6\u6CE8\u610F\u529Bsystem prompt");
    } else {
      let newTextMessage = {
        "content": "\u5173\u6CE8\u7528\u6237\u6700\u65B0\u7684\u6D88\u606F",
        "role": "system"
      };
      messages.splice(messages.length - 1, 0, newTextMessage);
      logger_default.info("\u6CE8\u5165\u63D0\u5347\u5C3E\u90E8\u6D88\u606F\u6CE8\u610F\u529Bsystem prompt");
    }
    content = messages.reduce((content2, message) => {
      if (_12.isArray(message.content)) {
        return message.content.reduce((_content, v) => {
          if (!_12.isObject(v) || v["type"] != "text") return _content;
          return _content + `${message.role || "user"}:${v["text"] || ""}
`;
        }, content2);
      }
      return content2 += `${message.role || "user"}:${message.role == "user" ? wrapUrlsToTags(message.content) : message.content}
`;
    }, "");
    logger_default.info("\n\u5BF9\u8BDD\u5408\u5E76\uFF1A\n" + content);
  }
  return [
    { role: "user", content }
  ];
}
function wrapUrlsToTags(content) {
  return content.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi, (url) => `<url id="" type="url" status="" title="" wc="">${url}</url>`);
}
async function preSignUrl(filename, refreshToken) {
  const {
    accessToken,
    userId
  } = await acquireToken(refreshToken);
  const result = await axios.post("https://kimi.moonshot.cn/api/pre-sign-url", {
    action: "file",
    name: filename
  }, {
    timeout: 15e3,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Referer: `https://kimi.moonshot.cn/`,
      "X-Msh-Platform": "web",
      "X-Traffic-Id": userId,
      ...FAKE_HEADERS
    },
    validateStatus: () => true
  });
  return checkResult(result, refreshToken);
}
async function checkFileUrl(fileUrl) {
  if (util_default.isBASE64Data(fileUrl))
    return;
  const result = await axios.head(fileUrl, {
    timeout: 15e3,
    validateStatus: () => true
  });
  if (result.status >= 400)
    throw new APIException(exceptions_default.API_FILE_URL_INVALID, `File ${fileUrl} is not valid: [${result.status}] ${result.statusText}`);
  if (result.headers && result.headers["content-length"]) {
    const fileSize = parseInt(result.headers["content-length"], 10);
    if (fileSize > FILE_MAX_SIZE)
      throw new APIException(exceptions_default.API_FILE_EXECEEDS_SIZE, `File ${fileUrl} is not valid`);
  }
}
async function uploadFile(fileUrl, refreshToken) {
  await checkFileUrl(fileUrl);
  let filename, fileData, mimeType;
  if (util_default.isBASE64Data(fileUrl)) {
    mimeType = util_default.extractBASE64DataFormat(fileUrl);
    const ext = mime3.getExtension(mimeType);
    filename = `${util_default.uuid()}.${ext}`;
    fileData = Buffer.from(util_default.removeBASE64DataHeader(fileUrl), "base64");
  } else {
    filename = path6.basename(fileUrl);
    ({ data: fileData } = await axios.get(fileUrl, {
      responseType: "arraybuffer",
      // 100M限制
      maxContentLength: FILE_MAX_SIZE,
      // 60秒超时
      timeout: 6e4
    }));
  }
  const {
    url: uploadUrl,
    object_name: objectName
  } = await preSignUrl(filename, refreshToken);
  mimeType = mimeType || mime3.getType(filename);
  const {
    accessToken,
    userId
  } = await acquireToken(refreshToken);
  let result = await axios.request({
    method: "PUT",
    url: uploadUrl,
    data: fileData,
    // 100M限制
    maxBodyLength: FILE_MAX_SIZE,
    // 120秒超时
    timeout: 12e4,
    headers: {
      "Content-Type": mimeType,
      Authorization: `Bearer ${accessToken}`,
      Referer: `https://kimi.moonshot.cn/`,
      "X-Msh-Platform": "web",
      "X-Traffic-Id": userId,
      ...FAKE_HEADERS
    },
    validateStatus: () => true
  });
  checkResult(result, refreshToken);
  let fileId, status, startTime = Date.now();
  while (status != "initialized") {
    if (Date.now() - startTime > 3e4)
      throw new Error("\u6587\u4EF6\u7B49\u5F85\u5904\u7406\u8D85\u65F6");
    result = await axios.post("https://kimi.moonshot.cn/api/file", {
      type: "file",
      name: filename,
      object_name: objectName,
      timeout: 15e3
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Referer: `https://kimi.moonshot.cn/`,
        "X-Msh-Platform": "web",
        "X-Traffic-Id": userId,
        ...FAKE_HEADERS
      }
    });
    ({ id: fileId, status } = checkResult(result, refreshToken));
  }
  startTime = Date.now();
  let parseFinish = false;
  while (!parseFinish) {
    if (Date.now() - startTime > 3e4)
      throw new Error("\u6587\u4EF6\u7B49\u5F85\u5904\u7406\u8D85\u65F6");
    parseFinish = await new Promise((resolve) => {
      axios.post("https://kimi.moonshot.cn/api/file/parse_process", {
        ids: [fileId],
        timeout: 12e4
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Referer: `https://kimi.moonshot.cn/`,
          "X-Msh-Platform": "web",
          "X-Traffic-Id": userId,
          ...FAKE_HEADERS
        }
      }).then(() => resolve(true)).catch(() => resolve(false));
    });
  }
  return fileId;
}
function checkResult(result, refreshToken) {
  if (result.status == 401) {
    accessTokenMap.delete(refreshToken);
    throw new APIException(exceptions_default.API_REQUEST_FAILED);
  }
  if (!result.data)
    return null;
  const { error_type, message } = result.data;
  if (!_12.isString(error_type))
    return result.data;
  if (error_type == "auth.token.invalid")
    accessTokenMap.delete(refreshToken);
  if (error_type == "chat.user_stream_pushing")
    throw new APIException(exceptions_default.API_CHAT_STREAM_PUSHING);
  throw new APIException(exceptions_default.API_REQUEST_FAILED, `[\u8BF7\u6C42kimi\u5931\u8D25]: ${message}`);
}
async function receiveStream(model, convId, stream, silentSearch = false) {
  let webSearchCount = 0;
  return new Promise((resolve, reject) => {
    const data = {
      id: convId,
      model,
      object: "chat.completion",
      choices: [
        { index: 0, message: { role: "assistant", content: "" }, finish_reason: "stop" }
      ],
      usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
      created: util_default.unixTimestamp()
    };
    let refContent = "";
    const parser = createParser((event) => {
      try {
        if (event.type !== "event") return;
        const result = _12.attempt(() => JSON.parse(event.data));
        if (_12.isError(result))
          throw new Error(`Stream response invalid: ${event.data}`);
        if (result.event == "cmpl" && result.text) {
          const exceptCharIndex = result.text.indexOf("\uFFFD");
          data.choices[0].message.content += result.text.substring(0, exceptCharIndex == -1 ? result.text.length : exceptCharIndex);
        } else if (result.event == "all_done" || result.event == "error") {
          data.choices[0].message.content += (result.event == "error" ? "\n[\u5185\u5BB9\u7531\u4E8E\u4E0D\u5408\u89C4\u88AB\u505C\u6B62\u751F\u6210\uFF0C\u6211\u4EEC\u6362\u4E2A\u8BDD\u9898\u5427]" : "") + (refContent ? `

\u641C\u7D22\u7ED3\u679C\u6765\u81EA\uFF1A
${refContent}` : "");
          refContent = "";
          resolve(data);
        } else if (!silentSearch && result.event == "search_plus" && result.msg && result.msg.type == "get_res") {
          webSearchCount += 1;
          refContent += `\u3010\u68C0\u7D22 ${webSearchCount}\u3011 [${result.msg.title}](${result.msg.url})

`;
        }
      } catch (err) {
        logger_default.error(err);
        reject(err);
      }
    });
    stream.on("data", (buffer) => parser.feed(buffer.toString()));
    stream.once("error", (err) => reject(err));
    stream.once("close", () => resolve(data));
  });
}
function createTransStream(model, convId, stream, silentSearch = false, endCallback) {
  const created = util_default.unixTimestamp();
  const transStream = new PassThrough();
  let webSearchCount = 0;
  let searchFlag = false;
  !transStream.closed && transStream.write(`data: ${JSON.stringify({
    id: convId,
    model,
    object: "chat.completion.chunk",
    choices: [
      { index: 0, delta: { role: "assistant", content: "" }, finish_reason: null }
    ],
    created
  })}

`);
  const parser = createParser((event) => {
    try {
      if (event.type !== "event") return;
      const result = _12.attempt(() => JSON.parse(event.data));
      if (_12.isError(result))
        throw new Error(`Stream response invalid: ${event.data}`);
      if (result.event === "append" || result.event === "set") {
        logger_default.info(`[Stream Event] type=${result.event}, path=${result.path}, view=${result.view}, value=${JSON.stringify(result.value).substring(0, 300)}`);
      }
      if (result.event == "cmpl") {
        const exceptCharIndex = result.text.indexOf("\uFFFD");
        const chunk = result.text.substring(0, exceptCharIndex == -1 ? result.text.length : exceptCharIndex);
        const data = `data: ${JSON.stringify({
          id: convId,
          model,
          object: "chat.completion.chunk",
          choices: [
            { index: 0, delta: { content: (searchFlag ? "\n" : "") + chunk }, finish_reason: null }
          ],
          created
        })}

`;
        if (searchFlag)
          searchFlag = false;
        !transStream.closed && transStream.write(data);
      } else if (result.event == "all_done" || result.event == "error") {
        const data = `data: ${JSON.stringify({
          id: convId,
          model,
          object: "chat.completion.chunk",
          choices: [
            {
              index: 0,
              delta: result.event == "error" ? {
                content: "\n[\u5185\u5BB9\u7531\u4E8E\u4E0D\u5408\u89C4\u88AB\u505C\u6B62\u751F\u6210\uFF0C\u6211\u4EEC\u6362\u4E2A\u8BDD\u9898\u5427]"
              } : {},
              finish_reason: "stop"
            }
          ],
          usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
          created
        })}

`;
        !transStream.closed && transStream.write(data);
        !transStream.closed && transStream.end("data: [DONE]\n\n");
        endCallback && endCallback();
      } else if (!silentSearch && result.event == "search_plus" && result.msg && result.msg.type == "get_res") {
        if (!searchFlag)
          searchFlag = true;
        webSearchCount += 1;
        const data = `data: ${JSON.stringify({
          id: convId,
          model,
          object: "chat.completion.chunk",
          choices: [
            {
              index: 0,
              delta: {
                content: `\u3010\u68C0\u7D22 ${webSearchCount}\u3011 [${result.msg.title}](${result.msg.url})
`
              },
              finish_reason: null
            }
          ],
          created
        })}

`;
        !transStream.closed && transStream.write(data);
      }
    } catch (err) {
      logger_default.error(err);
      !transStream.closed && transStream.end("\n\n");
    }
  });
  stream.on("data", (buffer) => parser.feed(buffer.toString()));
  stream.once("error", () => !transStream.closed && transStream.end("data: [DONE]\n\n"));
  stream.once("close", () => !transStream.closed && transStream.end("data: [DONE]\n\n"));
  return transStream;
}
function tokenSplit(authorization) {
  return authorization.replace("Bearer ", "").split(",");
}
async function getTokenLiveStatus(refreshToken) {
  const result = await axios.get("https://kimi.moonshot.cn/api/auth/token/refresh", {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
      Referer: "https://kimi.moonshot.cn/",
      ...FAKE_HEADERS
    },
    timeout: 15e3,
    validateStatus: () => true
  });
  try {
    const {
      access_token,
      refresh_token
    } = checkResult(result, refreshToken);
    return !!(access_token && refresh_token);
  } catch (err) {
    return false;
  }
}
var chat_default = {
  createConversation,
  createCompletion,
  createCompletionStream,
  getTokenLiveStatus,
  tokenSplit
};

// src/api/controllers/agent.ts
import { PassThrough as PassThrough2 } from "stream";
import _13 from "lodash";
var genId = () => util_default.uuid(false).slice(0, 24);
async function getText(model, promptContent, token) {
  const completion = await chat_default.createCompletion(
    model,
    [{ role: "user", content: promptContent }],
    token,
    false
  );
  const responseContent = completion?.choices?.[0]?.message?.content || "";
  return { responseContent, responseId: completion?.id || genId() };
}
function buildToolSystemPrompt(tools) {
  const toolDefs = tools.map((t) => t && t.type === "function" && t.function ? t.function : t).filter(Boolean);
  return [
    "# Tool Calling",
    "",
    "You are an agent with access to the tools listed below. When you need to use a tool, you MUST reply with one or more tool-call blocks in EXACTLY this format:",
    "",
    "<tool_call>",
    '{"name": "<tool_name>", "arguments": {<json-arguments>}}',
    "</tool_call>",
    "",
    "Strict rules:",
    "- When calling tools, output ONLY the <tool_call> block(s). No prose before or after.",
    '- "arguments" MUST be a valid JSON object matching the tool schema.',
    "- Emit several <tool_call> blocks to call multiple tools at once.",
    "- Tool results come back inside <tool_response> blocks; use them to continue.",
    "- When the task is done and you are giving the final answer, reply in plain text with NO <tool_call> block.",
    "",
    "Available tools (JSON Schema):",
    "<tools>",
    JSON.stringify(toolDefs, null, 2),
    "</tools>"
  ].join("\n");
}
function safeParseToolJson(raw) {
  if (!raw) return null;
  let s = raw.trim();
  const fence = s.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fence) s = fence[1].trim();
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
function toOpenAIToolCall(parsed) {
  const args = parsed.arguments;
  return {
    id: `call_${genId()}`,
    type: "function",
    function: {
      name: parsed.name,
      arguments: _13.isString(args) ? args : JSON.stringify(args ?? {})
    }
  };
}
function parseToolCalls(text) {
  const toolCalls = [];
  const regex = /<tool_call>\s*([\s\S]*?)\s*<\/tool_call>/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const parsed = safeParseToolJson(match[1]);
    if (parsed && parsed.name) toolCalls.push(toOpenAIToolCall(parsed));
  }
  let content = text.replace(regex, "").trim();
  if (!toolCalls.length) {
    const bare = safeParseToolJson(text);
    if (bare && bare.name && bare.arguments !== void 0) {
      toolCalls.push(toOpenAIToolCall(bare));
      content = "";
    }
  }
  return { content, toolCalls };
}
function extractTextContent(content) {
  if (_13.isString(content)) return content;
  if (_13.isArray(content)) {
    return content.filter(
      (p) => p && (p.type === "text" || p.type === "input_text" || p.type === "output_text") && p.text
    ).map((p) => p.text).join("\n");
  }
  return "";
}
var cap = (r) => r === "system" ? "System" : r === "assistant" ? "Assistant" : "User";
function messagesPrepareWithTools(messages, tools) {
  const parts = [];
  if (_13.isArray(tools) && tools.length) parts.push(buildToolSystemPrompt(tools));
  for (const msg of messages || []) {
    if (!msg) continue;
    if (msg.role === "tool") {
      const name = msg.name || msg.tool_call_id || "";
      parts.push(
        `Tool result${name ? ` for ${name}` : ""}:
<tool_response>
${extractTextContent(
          msg.content
        )}
</tool_response>`
      );
      continue;
    }
    let c = extractTextContent(msg.content);
    if (msg.role === "assistant" && _13.isArray(msg.tool_calls) && msg.tool_calls.length) {
      const calls = msg.tool_calls.map((tc) => {
        let args = tc.function?.arguments;
        try {
          args = JSON.parse(args);
        } catch {
        }
        return `<tool_call>
${JSON.stringify({ name: tc.function?.name, arguments: args ?? {} })}
</tool_call>`;
      }).join("\n");
      c = c ? `${c}
${calls}` : calls;
    }
    if (c) parts.push(`${cap(msg.role || "user")}: ${c}`);
  }
  parts.push("Assistant:");
  return parts.join("\n\n");
}
function prepareResponsesPrompt(instructions, input, tools) {
  const parts = [];
  if (_13.isArray(tools) && tools.length) parts.push(buildToolSystemPrompt(tools));
  if (instructions && _13.isString(instructions)) parts.push(`System: ${instructions}`);
  const items = _13.isString(input) ? [{ type: "message", role: "user", content: input }] : _13.isArray(input) ? input : [];
  for (const item of items) {
    if (!item) continue;
    const type = item.type || "message";
    if (type === "message") {
      const text = extractTextContent(item.content);
      if (text) parts.push(`${cap(item.role || "user")}: ${text}`);
    } else if (type === "function_call") {
      let args = item.arguments;
      try {
        args = JSON.parse(args);
      } catch {
      }
      parts.push(
        `Assistant: <tool_call>
${JSON.stringify({ name: item.name, arguments: args ?? {} })}
</tool_call>`
      );
    } else if (type === "function_call_output") {
      const out = _13.isString(item.output) ? item.output : JSON.stringify(item.output);
      parts.push(`Tool result:
<tool_response>
${out}
</tool_response>`);
    }
  }
  parts.push("Assistant:");
  return parts.join("\n\n");
}
async function createChatCompletion(model, messages, token, tools, toolChoice) {
  const useTools = _13.isArray(tools) && tools.length > 0 && toolChoice !== "none";
  if (!useTools) return chat_default.createCompletion(model, messages, token, false);
  const prompt = messagesPrepareWithTools(messages, tools);
  const { responseContent, responseId } = await getText(model, prompt, token);
  const { content, toolCalls } = parseToolCalls(responseContent);
  return {
    id: responseId,
    model,
    object: "chat.completion",
    choices: [
      {
        index: 0,
        message: toolCalls.length ? { role: "assistant", content: content || null, tool_calls: toolCalls } : { role: "assistant", content },
        finish_reason: toolCalls.length ? "tool_calls" : "stop"
      }
    ],
    usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
    created: util_default.unixTimestamp()
  };
}
async function createChatCompletionStream(model, messages, token, tools, toolChoice) {
  const useTools = _13.isArray(tools) && tools.length > 0 && toolChoice !== "none";
  if (!useTools) return chat_default.createCompletionStream(model, messages, token, false);
  const completion = await createChatCompletion(model, messages, token, tools, toolChoice);
  const choice = completion.choices[0];
  const ts = new PassThrough2();
  const base = { id: completion.id, model, object: "chat.completion.chunk", created: completion.created };
  const send = (delta, finish = null) => ts.write(`data: ${JSON.stringify({ ...base, choices: [{ index: 0, delta, finish_reason: finish }] })}

`);
  send({ role: "assistant", content: "" });
  if (choice.message.tool_calls?.length)
    send({
      tool_calls: choice.message.tool_calls.map((tc, i) => ({ index: i, ...tc }))
    });
  else if (choice.message.content) send({ content: choice.message.content });
  send({}, choice.finish_reason || "stop");
  ts.write("data: [DONE]\n\n");
  ts.end();
  return ts;
}
function buildResponsesOutput(textContent, toolCalls) {
  const output = [];
  if (textContent)
    output.push({
      type: "message",
      id: `msg_${genId()}`,
      status: "completed",
      role: "assistant",
      content: [{ type: "output_text", text: textContent, annotations: [] }]
    });
  for (const tc of toolCalls)
    output.push({
      type: "function_call",
      id: `fc_${genId()}`,
      call_id: tc.id,
      name: tc.function.name,
      arguments: tc.function.arguments,
      status: "completed"
    });
  return output;
}
async function createResponses(model, body, token) {
  const { instructions, input, tools, tool_choice } = body;
  const prompt = prepareResponsesPrompt(instructions, input, tools);
  const { responseContent } = await getText(model, prompt, token);
  const useTools = _13.isArray(tools) && tools.length > 0 && tool_choice !== "none";
  let textContent = responseContent;
  let toolCalls = [];
  if (useTools) {
    const parsed = parseToolCalls(responseContent);
    textContent = parsed.content;
    toolCalls = parsed.toolCalls;
  }
  return {
    id: `resp_${genId()}`,
    object: "response",
    created_at: util_default.unixTimestamp(),
    status: "completed",
    model,
    output: buildResponsesOutput(textContent, toolCalls),
    usage: { input_tokens: 1, output_tokens: 1, total_tokens: 2 }
  };
}
function createResponsesStream(model, body, token) {
  const { instructions, input, tools, tool_choice } = body;
  const prompt = prepareResponsesPrompt(instructions, input, tools);
  const useTools = _13.isArray(tools) && tools.length > 0 && tool_choice !== "none";
  const respId = `resp_${genId()}`;
  const ts = new PassThrough2();
  let seq = 0;
  const emit = (type, obj) => {
    try {
      ts.write(`event: ${type}
data: ${JSON.stringify({ type, sequence_number: seq++, ...obj })}

`);
    } catch {
    }
  };
  const resp = (status, out, error) => ({
    id: respId,
    object: "response",
    created_at: util_default.unixTimestamp(),
    status,
    model,
    output: out,
    error: error || null,
    usage: status === "completed" ? { input_tokens: 1, output_tokens: 1, total_tokens: 2 } : null
  });
  emit("response.created", { response: resp("in_progress", []) });
  emit("response.in_progress", { response: resp("in_progress", []) });
  const heartbeat = setInterval(() => {
    try {
      ts.write(`: keepalive

`);
    } catch {
    }
  }, 5e3);
  (async () => {
    try {
      const { responseContent } = await getText(model, prompt, token);
      let textContent = responseContent;
      let toolCalls = [];
      if (useTools) {
        const parsed = parseToolCalls(responseContent);
        textContent = parsed.content;
        toolCalls = parsed.toolCalls;
      }
      const output = buildResponsesOutput(textContent, toolCalls);
      let idx = 0;
      for (const item of output) {
        if (item.type === "message") {
          const text = item.content[0].text;
          emit("response.output_item.added", { output_index: idx, item: { ...item, status: "in_progress", content: [] } });
          emit("response.content_part.added", { item_id: item.id, output_index: idx, content_index: 0, part: { type: "output_text", text: "", annotations: [] } });
          emit("response.output_text.delta", { item_id: item.id, output_index: idx, content_index: 0, delta: text });
          emit("response.output_text.done", { item_id: item.id, output_index: idx, content_index: 0, text });
          emit("response.content_part.done", { item_id: item.id, output_index: idx, content_index: 0, part: item.content[0] });
          emit("response.output_item.done", { output_index: idx, item });
        } else if (item.type === "function_call") {
          emit("response.output_item.added", { output_index: idx, item: { ...item, status: "in_progress", arguments: "" } });
          emit("response.function_call_arguments.delta", { item_id: item.id, output_index: idx, delta: item.arguments });
          emit("response.function_call_arguments.done", { item_id: item.id, output_index: idx, arguments: item.arguments });
          emit("response.output_item.done", { output_index: idx, item });
        }
        idx++;
      }
      emit("response.completed", { response: resp("completed", output) });
      ts.write("data: [DONE]\n\n");
    } catch (err) {
      logger_default.error("responses stream error:", err?.message || err);
      emit("response.failed", { response: resp("failed", [], { code: "upstream_error", message: String(err?.message || err) }) });
      ts.write("data: [DONE]\n\n");
    } finally {
      clearInterval(heartbeat);
      ts.end();
    }
  })();
  return ts;
}
var agent_default = {
  tokenSplit: chat_default.tokenSplit,
  createChatCompletion,
  createChatCompletionStream,
  createResponses,
  createResponsesStream
};

// src/api/routes/chat.ts
var chat_default2 = {
  prefix: "/v1/chat",
  post: {
    "/completions": async (request) => {
      request.validate("body.conversation_id", (v) => _14.isUndefined(v) || _14.isString(v)).validate("body.messages", _14.isArray).validate("headers.authorization", _14.isString);
      const tokens = chat_default.tokenSplit(request.headers.authorization);
      const token = _14.sample(tokens);
      const { model, conversation_id: convId, messages, stream, use_search, tools, tool_choice } = request.body;
      const hasTools = _14.isArray(tools) && tools.length > 0 && tool_choice !== "none";
      if (stream) {
        const stream2 = hasTools ? await agent_default.createChatCompletionStream(model, messages, token, tools, tool_choice) : await chat_default.createCompletionStream(model, messages, token, use_search, convId);
        return new Response(stream2, {
          type: "text/event-stream"
        });
      } else
        return hasTools ? await agent_default.createChatCompletion(model, messages, token, tools, tool_choice) : await chat_default.createCompletion(model, messages, token, use_search, convId);
    }
  }
};

// src/api/routes/responses.ts
import _15 from "lodash";
import process2 from "process";
var KIMI_AUTHORIZATION = process2.env.KIMI_AUTHORIZATION;
var responses_default = {
  prefix: "/v1",
  post: {
    "/responses": async (request) => {
      request.validate("headers.authorization", _15.isString);
      if (KIMI_AUTHORIZATION)
        request.headers.authorization = "Bearer " + KIMI_AUTHORIZATION;
      const tokens = agent_default.tokenSplit(request.headers.authorization);
      const token = _15.sample(tokens);
      let { model, stream } = request.body;
      model = (model || "kimi").toLowerCase();
      if (stream) {
        const responseStream = await agent_default.createResponsesStream(model, request.body, token);
        return new Response(responseStream, { type: "text/event-stream" });
      }
      return await agent_default.createResponses(model, request.body, token);
    }
  }
};

// src/api/routes/ping.ts
var ping_default = {
  prefix: "/ping",
  get: {
    "": async () => "pong"
  }
};

// src/api/routes/token.ts
import _16 from "lodash";
var token_default = {
  prefix: "/token",
  post: {
    "/check": async (request) => {
      request.validate("body.token", _16.isString);
      const live = await chat_default.getTokenLiveStatus(request.body.token);
      return {
        live
      };
    }
  }
};

// src/api/routes/models.ts
var models_default = {
  prefix: "/v1",
  get: {
    "/models": async () => {
      return {
        "data": [
          {
            "id": "moonshot-v1",
            "object": "model",
            "owned_by": "kimi-free-api"
          },
          {
            "id": "moonshot-v1-8k",
            "object": "model",
            "owned_by": "kimi-free-api"
          },
          {
            "id": "moonshot-v1-32k",
            "object": "model",
            "owned_by": "kimi-free-api"
          },
          {
            "id": "moonshot-v1-128k",
            "object": "model",
            "owned_by": "kimi-free-api"
          },
          {
            "id": "moonshot-v1-vision",
            "object": "model",
            "owned_by": "kimi-free-api"
          },
          {
            "id": "kimi-k1.5",
            "object": "model",
            "owned_by": "kimi-free-api"
          },
          {
            "id": "kimi-k2.5",
            "object": "model",
            "owned_by": "kimi-free-api"
          },
          {
            "id": "kimi-k2.5-vision",
            "object": "model",
            "owned_by": "kimi-free-api"
          },
          {
            "id": "kimi-search",
            "object": "model",
            "owned_by": "kimi-free-api"
          },
          {
            "id": "kimi-research",
            "object": "model",
            "owned_by": "kimi-free-api"
          },
          {
            "id": "kimi-k1.5-search",
            "object": "model",
            "owned_by": "kimi-free-api"
          }
        ]
      };
    }
  }
};

// src/api/routes/index.ts
var routes_default = [
  {
    get: {
      "/": async () => {
        const content = await fs6.readFile("public/welcome.html");
        return new Response(content, {
          type: "html",
          headers: {
            Expires: "-1"
          }
        });
      }
    }
  },
  chat_default2,
  responses_default,
  ping_default,
  token_default,
  models_default
];

// src/vercel.ts
server_default.attachRoutes(routes_default);
var vercel_default = server_default.app.callback();
export {
  vercel_default as default
};
//# sourceMappingURL=vercel.js.map