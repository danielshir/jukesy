Model.User = Backbone.Model.extend({
  urlRoot: '/user',
  url: function() {
    var url = this.urlRoot
    if (!this.isNew()) {
      url += '/' + this.get('username')
    }
    return url
  },
  
  isCurrentUser: function() {
    if (!Session.user || Session.user.id != this.id) {
      return false
    } else {
      return true
    }
  }
})


View.User = Backbone.View.extend({
  template: jade.compile($('#user-show-template').text()),
  
  render: function() {
    this.$el.html(this.template({
      user: this.model.toJSON(),
      currentUser: Session.userJSON()
    }))
    return this
  }
    
})

View.UserEdit = Backbone.View.extend(_.extend({
  template: jade.compile($('#user-edit-template').text()),
    
  events: {
    'click a.btn-primary' : 'submit',
    'keypress input'      : 'keyDown'
  },
    
  initialize: function() {
    _.bindAll(this, 'submit', 'keyDown', 'submitSuccess', 'submitError')
  },
    
  render: function() {
    if (this.model.isCurrentUser()) {
      this.$el.html(this.template({
        user: this.model.toJSON(),
        currentUser: Session.userJSON()
      }))
    } else {
      _.defer(function() {
        MainView.render('401')
      })
    }

    return this
  },
    
  keyDown: function(event) {
    if (event.keyCode == 13) {
      this.submit()
      $(event.target).blur()
    }
  },
    
  submitSuccess: function(model, response) {
    alert('success!')
  }
      
}, Mixins.ViewFormErrors))


View.UserCreate = Backbone.View.extend(_.extend({
  template: jade.compile($('#user-new-template').text()),
  
  elAlert: '.modal-body',

  events: {
    'click a.btn-primary' : 'submit',
    'keypress input'      : 'keyDown',
    'click a.sign-in'     : 'newSession'
  },
    
  initialize: function() {
    _.bindAll(this, 'submit', 'keyDown', 'submitSuccess', 'submitError', 'newSession')
    this.$el = $(this.el)
    this.model = new Model.User
    this.render()
  },
    
  newSession: function() {
    new View.SessionCreate({ model: Session })
    return false
  },
    
  render: function() {
    this.$el.html(this.template())
    ModalView.render(this.$el)
  },

  keyDown: function(event) {
    if (event.keyCode == 13) {
      this.submit()
      $(event.target).blur()
    }
  },
  
  submitSuccess: function(model, response) {
    Session.login()
    ModalView.hide()
  }
  
}, Mixins.ViewFormErrors))
