hexo.extend.tag.register('ruby', function(args) {

  var splited = args.join(' ').split('|');

  var origin = splited[0].trim();

  var ruby = origin;
  if (splited.length > 1) {
  	ruby = splited[1].trim();
  }

  var ruby_result = "<ruby>" + origin + "<rp> (</rp><rt>" + ruby + "</rt><rp>) </rp></ruby>"
  
  return ruby_result;
});
