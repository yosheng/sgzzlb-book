// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="introduction.html">简介</a></li><li class="chapter-item expanded "><a href="seasons.html">赛季总览</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="season1/index.html">赛季1</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="season1/introduction.html">简介</a></li><li class="chapter-item expanded "><a href="season1/newbie.html">新手教程</a></li><li class="chapter-item expanded "><a href="season1/newbie-reclaim.html">新手开荒</a></li><li class="chapter-item expanded "><a href="season1/reclaim-team.html">开荒组合搭配</a></li><li class="chapter-item expanded "><a href="season1/general.html">武将解析</a></li><li class="chapter-item expanded "><a href="season1/team-composition.html">阵容搭配</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="season1/team-composition-shu.html">蜀解析</a></li><li class="chapter-item expanded "><a href="season1/team-composition-wei.html">魏解析</a></li><li class="chapter-item expanded "><a href="season1/team-composition-wu.html">吴解析</a></li><li class="chapter-item expanded "><a href="season1/team-composition-qun.html">群解析</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="season2/index.html">赛季2</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="season2/introduction.html">简介</a></li><li class="chapter-item expanded "><a href="season2/prepare.html">开荒前准备</a></li><li class="chapter-item expanded "><a href="season2/reclaim-team.html">开荒组合搭配</a></li></ol></li><li class="chapter-item expanded "><a href="season3/index.html">赛季3</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="season3/reclaim-team.html">开荒组合搭配</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="seasons-general.html">赛季武将盘点</a></li><li class="chapter-item expanded "><a href="tactics.html">战法</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString();
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);