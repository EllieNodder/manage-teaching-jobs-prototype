const users = require('../data/users.json')
const organisations = require('../data/organisations.json')
const jobs = require('../data/jobs.json')

module.exports = router => {

  router.get('/account/sign-in', (req, res) => {
    var options = users.map(user => {

      let hint = user.organisation.type

      if(user.organisation.type == 'School') {
        hint = user.organisation.phase
      } else {
        hint = user.organisation.type
      }

      return {
        text: user.username,
        value: user.username,
        hint: {
          text: hint
        }
      }
    })
    res.render('account/sign-in', {
      options
    })
  })

  router.post('/account/sign-in', (req, res) => {

    let user

    if(req.body.emailAddress) {
      user = users.find(user => user.username == req.body.emailAddress)
    } else {
      user = users[0]
    }

    // add jobs to the user
    user.jobs = jobs.filter(job => job.organisation.name == user.organisation.name)

    res.locals.user = req.session.user = user

    if(req.body.returnUrl) {
      res.redirect(req.body.returnUrl)
    } else {
      res.redirect('/jobs')
    }
  })

  router.get('/sign-out', (req, res) => {
    res.locals.user = req.session.user = null
    res.redirect('/')
  })

  router.post('/account/new', (req, res) => {
    res.locals.user = req.session.user = {
      username: req.body.emailAddress,
      password: req.body.password,
      organisation: organisations.find(org => org.name == 'Bushey Meads Secondary School')
    }
    res.redirect('/account/new/confirmation')
  })

}