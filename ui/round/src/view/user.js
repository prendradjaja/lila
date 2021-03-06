var m = require('mithril');
var game = require('game').game;
var raf = require('chessground').util.requestAnimationFrame;

function ratingDiff(player) {
  if (typeof player.ratingDiff === 'undefined') return null;
  if (player.ratingDiff === 0) return m('span.rp.null', '±0');
  if (player.ratingDiff > 0) return m('span.rp.up', '+' + player.ratingDiff);
  if (player.ratingDiff < 0) return m('span.rp.down', player.ratingDiff);
}

function relayUser(player) {
  return m('span', {
    class: 'text',
    'data-icon': '8'
  }, [
    (player.title ? player.title + ' ' : '') + player.name,
    player.rating ? ' (' + player.rating + ')' : ''
  ]);
}

function aiName(ctrl, player) {
  return ctrl.trans('aiNameLevelAiLevel', 'Stockfish', player.ai);
}

module.exports = {
  userHtml: function(ctrl, player) {
    var d = ctrl.data;
    var user = player.user;
    if (d.relay) return relayUser(d.relay[player.color]);
    var perf = user ? user.perfs[d.game.perf] : null;
    var rating = player.rating ? player.rating : (perf ? perf.rating : null);
    if (user) {
      var fullName = (user.title ? user.title + ' ' : '') + user.username;
      var connecting = !player.onGame && ctrl.vm.firstSeconds && user.online;
      var isMe = ctrl.userId === user.id;
      return m('div', {
        class: 'username user_link ' + player.color + ' ' +
          (player.onGame ? 'online' : 'offline') +
          (fullName.length > 20 ? ' long' : '') +
          (connecting ? ' connecting' : '')
      }, [
        m('i', {
          class: 'line' + (user.patron ? ' patron' : ''),
          'title': connecting ? 'Connecting to the game' : (player.onGame ? 'Joined the game' : 'Left the game')
        }),
        m('a', {
          class: 'text ulpt',
          'data-pt-pos': 's',
          href: '/@/' + user.username,
          target: game.isPlayerPlaying(d) ? '_blank' : '_self',
        }, fullName),
        rating ? m('rating', rating + (player.provisional ? '?' : '')) : null,
        ratingDiff(player),
        player.engine ? m('span[data-icon=j]', {
          title: ctrl.trans('thisPlayerUsesChessComputerAssistance')
        }) : null
      ]);
    }
    var connecting = !player.onGame && ctrl.vm.firstSeconds;
    return m('div', {
      class: 'username user_link ' +
        (player.onGame ? 'online' : 'offline') +
        (connecting ? ' connecting' : ''),
    }, [
      m('i', {
        class: 'line',
        'title': connecting ? 'Connecting to the game' : (player.onGame ? 'Joined the game' : 'Left the game')
      }),
      m('name', player.name || 'Anonymous')
    ]);
  },
  userTxt: function(ctrl, player) {
    if (player.user) {
      var perf = player.user.perfs[ctrl.data.game.perf];
      var name = (player.user.title ? player.user.title + ' ' : '') + player.user.username;
      var rating = player.rating ? player.rating : (perf ? perf.rating : null);
      rating = rating ? ' (' + rating + (player.provisional ? '?' : '') + ')' : '';
      return name + rating;
    } else if (player.ai) return aiName(ctrl, player)
    else return 'Anonymous';
  },
  aiName: aiName
};
