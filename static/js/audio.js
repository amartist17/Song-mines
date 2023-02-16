$(".icon-play").click(function (e) {
  let $this = $(this);
  let id = $this.attr("id").replace("-btn", "");
  $this.toggleClass("active");
  let audio = $("#" + id)[0];
  if ($this.hasClass("active")) {
    $this.removeClass("icon-play");
    $this.addClass("icon-pause");
    audio.play();
  } else {
    $this.removeClass("icon-pause");
    $this.addClass("icon-play");
    audio.pause();
  }
  audio.addEventListener("ended", function (e) {
    $this.toggleClass("active");
    $this.removeClass("icon-pause");
    $this.addClass("icon-play");
  });
});
