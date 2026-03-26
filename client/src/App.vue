<template>
  <header>
    <nav>
      <RouterLink to="/">Dashboard</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
nav {
  padding: 20px;
  background: #42b883;
  margin-bottom: 20px;
}
nav a {
  color: white;
  font-weight: bold;
  text-decoration: none;
}
</style>
