import * as http from 'http';

const accessToken =
  'eyJraWQiOiJzU2xGakJrajV5cVZWU0dGOFhKWkQ2dTdCcko4QzFDbFwvbG1NbTRwUkNCVT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJlNDc4YjQ2OC02MGIxLTcwYzUtZWE2YS1lOGNhYjQ0YmMzNGMiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9YaG9rMExOMVMiLCJjbGllbnRfaWQiOiIzbzAwOHRuN3ZhbDY0bjJicGZwMTkwYTBkayIsIm9yaWdpbl9qdGkiOiJjYzE3OGYyMi0xZWVjLTQ0YjktOTg1YS0zOTE1MDNiMzVmNjAiLCJldmVudF9pZCI6IjdhZTZjZGVlLTc4MTktNDlhYy05YTBkLWU3NWUxMmUyY2UyMCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3NjMzMzI0NjksImV4cCI6MTc2MzQxODg2OSwiaWF0IjoxNzYzMzMyNDY5LCJqdGkiOiI1OWY3M2M5OS00OGZiLTQ5YjctYWJmNC00ZDcwMzViZGM3YjciLCJ1c2VybmFtZSI6ImU0NzhiNDY4LTYwYjEtNzBjNS1lYTZhLWU4Y2FiNDRiYzM0YyJ9.nvUcSyKGuYHsihwyXZtQ4TbGuSxBVFHYaVEpdg0D9UJRhCjNfxzLOOd4JfQ9Rpol_V9xLSIGJYlpmEPh4BzdzIYUQMT27tHNmCcU9AXIGqvaDoqUlQWQgUGz4ARQ31BPqBJmy8QNJH1zwX3-N03wkod05z2wlNS_HYEhU0UKjs5dWpcymxojxvQsLhqKmxuWUI3x_-8yzwxwHAWq-nbSg-VFtmxZ5DV45iC7Bw7bmFZs6aqIi6_y5Oh5q2Cr_X_5Ug2vE4M-KxoTJ6_oIMWIGFwAqFM4akry4q56aDEymD2Yrhv9LbNvYQNgC0Mh4UCkLuMt__d0Z7Rz_VzdtLiJFw';

const idToken =
  'eyJraWQiOiJTYmZLdVpaXC95eXgrcVJGc2hVdklydnZ0akJmS2VWcjh1ZlFsOVViY1JYMD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJlNDc4YjQ2OC02MGIxLTcwYzUtZWE2YS1lOGNhYjQ0YmMzNGMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfWGhvazBMTjFTIiwiY29nbml0bzp1c2VybmFtZSI6ImU0NzhiNDY4LTYwYjEtNzBjNS1lYTZhLWU4Y2FiNDRiYzM0YyIsInByZWZlcnJlZF91c2VybmFtZSI6InJvb3QiLCJvcmlnaW5fanRpIjoiY2MxNzhmMjItMWVlYy00NGI5LTk4NWEtMzkxNTAzYjM1ZjYwIiwiYXVkIjoiM28wMDh0bjd2YWw2NG4yYnBmcDE5MGEwZGsiLCJldmVudF9pZCI6IjdhZTZjZGVlLTc4MTktNDlhYy05YTBkLWU3NWUxMmUyY2UyMCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzYzMzMyNDY5LCJuYW1lIjoiUm9vdCBTdXBlcnVzZXIiLCJleHAiOjE3NjM0MTg4NjksImlhdCI6MTc2MzMzMjQ2OSwianRpIjoiMWUwYWMxZGItZDM2Yy00ODdhLWE3MWEtYzZjOTA2Yzk1ZGYwIiwiZW1haWwiOiJyb290QGV4YW1wbGUuY29tIn0.v1ZqlFGG7pzbehu2eOxOGoURkbwxqIkhAL1blLozWUUUl0KudTV9cFJcLo5BkcKUjisfV7iK5b2wuPlYJB-jGSstXnGoStivcAIZWD7rwvO-rllLjfPuxLNdMmhDmDQAx-cBtgf0i-h9CjuF4ENFnTGBE82Xe7s_AIeZYvvkRvG0exiUBuPCcgmCXMc6HLUjJGj4pztVNSzqkvALJT9VfCDCk8f0iHmLiKI_eNQOv3QTn7MsbvXimYl1YihhCqYTRKKOH8mBQdUcKjwUrV_4Y4M8OldRLKXoLXgg9F8_KmhtgGBbKSRRyaxOblWkrH6sYfsOKZlsYkABuQwnxljmvA';

async function testUsersEndpoint() {
  return new Promise<void>((resolve, reject) => {
    console.log(
      '🔍 Probando endpoint GET /v1/users con tokens de Cognito...\n',
    );

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/v1/users',
      method: 'GET',
      headers: {
        'x-access-token': accessToken,
        authorization: `Bearer ${idToken}`,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          console.log('✅ Respuesta exitosa:');
          console.log(JSON.stringify(JSON.parse(data), null, 2));
          console.log('\n📊 Status:', res.statusCode);
          resolve();
        } else {
          console.error('❌ Error en la petición:');
          console.error('Status:', res.statusCode);
          console.error('Data:', data);

          if (res.statusCode === 401) {
            console.error(
              '\n⚠️  Error 401: Usuario no autenticado o sin permisos',
            );
            console.error('Verificar:');
            console.error('1. Que JwtAuthGuard esté aplicado al endpoint');
            console.error('2. Que RoleGuard esté validando correctamente');
            console.error('3. Que request.user tenga la propiedad roles');
          } else if (res.statusCode === 403) {
            console.error('\n⚠️  Error 403: Sin permisos suficientes');
            console.error('El usuario no tiene el rol requerido');
          }
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Error de conexión:', error.message);
      console.error(
        '\n⚠️  Asegúrate de que el servidor esté corriendo en http://localhost:3000',
      );
      reject(error);
    });

    req.end();
  });
}

testUsersEndpoint()
  .then(() => {
    console.log('\n✅ Test completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test fallido:', error.message);
    process.exit(1);
  });
