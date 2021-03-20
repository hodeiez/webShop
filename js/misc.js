
/**
 * toggles a sidebar, calling from sidebar-toggle, to toggle wrapper (check more in style.css about it)
 */
$(function(){
    $("#sidebar-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
  });