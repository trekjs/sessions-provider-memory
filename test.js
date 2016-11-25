import test from 'ava'
import MemoryProvider from './'

const sleep = n => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, n)
  })
}

test('should return an undefined session', t => {
  const memory = new MemoryProvider()

  const sess = memory.get('233')

  t.is(sess, undefined)
})

test('should save a session', t => {
  const memory = new MemoryProvider()

  const sess = {
    cookie: {}
  }

  memory.set('233', sess, 1000)

  const sess2 = memory.get('233')

  t.deepEqual(sess, sess2)
})

test('should save a session again', t => {
  const memory = new MemoryProvider()

  const sess = {
    cookie: {}
  }

  memory.set('233', sess, 1000)
  memory.set('233', sess, 1000)

  const sess2 = memory.get('233')

  t.deepEqual(sess, sess2)
})

test('should return a undefined session when expires', t => {
  const memory = new MemoryProvider()

  const sess = {
    cookie: {
      expires: 100
    }
  }

  memory.set('233', sess, 100)

  const sess2 = memory.get('233')

  t.is(sess2, undefined)
})

test('should auto delete when expires', async t => {
  const memory = new MemoryProvider()

  const sess = {
    cookie: {
      expires: 1000
    }
  }

  memory.set('233', sess, 1000)

  await sleep(1500)

  const sess2 = memory.get('233')

  t.is(sess2, undefined)
})
